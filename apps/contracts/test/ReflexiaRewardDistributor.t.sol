// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {ReflexiaRewardDistributor} from "../src/ReflexiaRewardDistributor.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock USDm", "USDm") {
        _mint(msg.sender, 1_000_000 * 10**18);
    }
}

contract ReflexiaRewardDistributorTest is Test {
    ReflexiaRewardDistributor public distributor;
    MockERC20 public token;

    uint256 public signerPrivateKey;
    address public signer;

    address public user1;
    address public user2;

    uint256 public maxDailyLimit = 100 * 10**18;
    uint256 public maxTotalLimit = 1000 * 10**18;

    function setUp() public {
        token = new MockERC20();
        
        signerPrivateKey = 0xA11CE;
        signer = vm.addr(signerPrivateKey);

        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        distributor = new ReflexiaRewardDistributor(
            address(token),
            signer,
            maxDailyLimit,
            maxTotalLimit
        );

        // Fund the distributor with some USDm
        token.transfer(address(distributor), 500 * 10**18);
    }

    function _getSignature(
        address recipient,
        uint256 amount,
        uint256 nonce,
        uint256 expiresAt,
        uint256 privateKey
    ) internal view returns (bytes memory) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(recipient, amount, nonce, expiresAt, address(distributor))
        );
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, ethSignedMessageHash);
        return abi.encodePacked(r, s, v);
    }

    function test_SetupState() public view {
        assertEq(address(distributor.token()), address(token));
        assertEq(distributor.signer(), signer);
        assertEq(distributor.maxDailyPayoutPerUser(), maxDailyLimit);
        assertEq(distributor.maxTotalPayout(), maxTotalLimit);
        assertEq(distributor.totalPayouts(), 0);
    }

    function test_ClaimSuccess() public {
        uint256 amount = 10 * 10**18;
        uint256 nonce = 1;
        uint256 expiresAt = block.timestamp + 1 hours;

        bytes memory signature = _getSignature(user1, amount, nonce, expiresAt, signerPrivateKey);

        uint256 balanceBefore = token.balanceOf(user1);

        vm.prank(user1);
        distributor.claim(user1, amount, nonce, expiresAt, signature);

        assertEq(token.balanceOf(user1) - balanceBefore, amount);
        assertTrue(distributor.usedNonces(nonce));
        assertEq(distributor.totalPayouts(), amount);
    }

    function test_ClaimExpiry() public {
        uint256 amount = 10 * 10**18;
        uint256 nonce = 1;
        uint256 expiresAt = block.timestamp + 1 hours;

        bytes memory signature = _getSignature(user1, amount, nonce, expiresAt, signerPrivateKey);

        // Warp past expiration
        vm.warp(block.timestamp + 2 hours);

        vm.prank(user1);
        vm.expectRevert("Voucher expired");
        distributor.claim(user1, amount, nonce, expiresAt, signature);
    }

    function test_ClaimDuplicateNonce() public {
        uint256 amount = 10 * 10**18;
        uint256 nonce = 1;
        uint256 expiresAt = block.timestamp + 1 hours;

        bytes memory signature = _getSignature(user1, amount, nonce, expiresAt, signerPrivateKey);

        vm.prank(user1);
        distributor.claim(user1, amount, nonce, expiresAt, signature);

        // Try to claim again with same signature/nonce
        vm.prank(user1);
        vm.expectRevert("Nonce already used");
        distributor.claim(user1, amount, nonce, expiresAt, signature);
    }

    function test_FrontRunningPrevention() public {
        uint256 amount = 10 * 10**18;
        uint256 nonce = 1;
        uint256 expiresAt = block.timestamp + 1 hours;

        bytes memory signature = _getSignature(user1, amount, nonce, expiresAt, signerPrivateKey);

        // User2 attempts to call claim for User1
        vm.prank(user2);
        vm.expectRevert("Caller is not the recipient");
        distributor.claim(user1, amount, nonce, expiresAt, signature);
    }

    function test_InvalidSignature() public {
        uint256 amount = 10 * 10**18;
        uint256 nonce = 1;
        uint256 expiresAt = block.timestamp + 1 hours;

        // Sign with a different private key
        bytes memory signature = _getSignature(user1, amount, nonce, expiresAt, 0xBAD123);

        vm.prank(user1);
        vm.expectRevert("Invalid signature");
        distributor.claim(user1, amount, nonce, expiresAt, signature);
    }

    function test_MaxDailyPayoutLimit() public {
        uint256 amount1 = 60 * 10**18;
        uint256 amount2 = 50 * 10**18; // total = 110 (exceeds maxDailyLimit of 100)

        bytes memory sig1 = _getSignature(user1, amount1, 1, 0, signerPrivateKey);
        bytes memory sig2 = _getSignature(user1, amount2, 2, 0, signerPrivateKey);

        vm.prank(user1);
        distributor.claim(user1, amount1, 1, 0, sig1);

        vm.prank(user1);
        vm.expectRevert("Daily user payout limit exceeded");
        distributor.claim(user1, amount2, 2, 0, sig2);
    }

    function test_MaxTotalPayoutLimit() public {
        // Change max total payout to something small
        vm.prank(distributor.owner());
        distributor.setMaxTotalPayout(15 * 10**18);

        uint256 amount = 10 * 10**18;
        
        bytes memory sig1 = _getSignature(user1, amount, 1, 0, signerPrivateKey);
        bytes memory sig2 = _getSignature(user2, amount, 2, 0, signerPrivateKey);

        vm.prank(user1);
        distributor.claim(user1, amount, 1, 0, sig1);

        vm.prank(user2);
        vm.expectRevert("Global payout pool limit exceeded");
        distributor.claim(user2, amount, 2, 0, sig2);
    }

    function test_AdminFunctions() public {
        address newSigner = makeAddr("newSigner");
        address newToken = address(new MockERC20());

        // Test onlyOwner restrictions
        vm.startPrank(user1);
        vm.expectRevert();
        distributor.setSigner(newSigner);
        vm.expectRevert();
        distributor.setToken(newToken);
        vm.expectRevert();
        distributor.setMaxDailyPayoutPerUser(50 * 10**18);
        vm.expectRevert();
        distributor.setMaxTotalPayout(2000 * 10**18);
        vm.expectRevert();
        distributor.withdrawToken(user1, 100);
        vm.stopPrank();

        // Test owner success
        address owner = distributor.owner();
        vm.startPrank(owner);
        
        distributor.setSigner(newSigner);
        assertEq(distributor.signer(), newSigner);

        distributor.setToken(newToken);
        assertEq(address(distributor.token()), newToken);

        distributor.setMaxDailyPayoutPerUser(50 * 10**18);
        assertEq(distributor.maxDailyPayoutPerUser(), 50 * 10**18);

        distributor.setMaxTotalPayout(2000 * 10**18);
        assertEq(distributor.maxTotalPayout(), 2000 * 10**18);

        uint256 contractBalance = token.balanceOf(address(distributor));
        uint256 user1BalanceBefore = token.balanceOf(user1);
        
        distributor.setToken(address(token)); // switch back to original mock token to withdraw
        distributor.withdrawToken(user1, contractBalance);
        
        assertEq(token.balanceOf(address(distributor)), 0);
        assertEq(token.balanceOf(user1) - user1BalanceBefore, contractBalance);
        
        vm.stopPrank();
    }
}
