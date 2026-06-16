// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title ReflexiaRewardDistributor
 * @dev Manages USDm reward claims for the Reflexia mini-game on the Celo network.
 * Uses a voucher-based system signed off-chain by a validated game backend.
 * 
 * Signature generation in Node.js (EIP-191):
 * ----------------------------------------------------
 * const ethers = require("ethers");
 * const msgHash = ethers.solidityPackedKeccak256(
 *   ["address", "uint256", "uint256", "uint256", "address"],
 *   [recipientAddress, amount, nonce, expiresAt, contractAddress]
 * );
 * const signature = await signerWallet.signMessage(ethers.getBytes(msgHash));
 * 
 * Verification in frontend:
 * ----------------------------------------------------
 * Simply pass the signature to the claim function on this contract:
 * await contract.claim(recipient, amount, nonce, expiresAt, signature);
 */
contract ReflexiaRewardDistributor is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    IERC20 public token;
    address public signer;

    uint256 public maxDailyPayoutPerUser;
    uint256 public maxTotalPayout;
    uint256 public totalPayouts;

    mapping(uint256 => bool) public usedNonces;
    // user => dayIndex => claimedAmount
    mapping(address => mapping(uint256 => uint256)) public claimedToday;

    event RewardClaimed(address indexed recipient, uint256 amount, uint256 indexed nonce, uint256 dayIndex);
    event TokenUpdated(address indexed oldToken, address indexed newToken);
    event SignerUpdated(address indexed oldSigner, address indexed newSigner);
    event MaxDailyPayoutPerUserUpdated(uint256 oldLimit, uint256 newLimit);
    event MaxTotalPayoutUpdated(uint256 oldMax, uint256 newMax);
    event TokensWithdrawn(address indexed to, uint256 amount);

    constructor(
        address _token,
        address _signer,
        uint256 _maxDailyPayoutPerUser,
        uint256 _maxTotalPayout
    ) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        require(_signer != address(0), "Invalid signer address");
        token = IERC20(_token);
        signer = _signer;
        maxDailyPayoutPerUser = _maxDailyPayoutPerUser;
        maxTotalPayout = _maxTotalPayout;

        emit TokenUpdated(address(0), _token);
        emit SignerUpdated(address(0), _signer);
        emit MaxDailyPayoutPerUserUpdated(0, _maxDailyPayoutPerUser);
        emit MaxTotalPayoutUpdated(0, _maxTotalPayout);
    }

    /**
     * @notice Claim USDm rewards using a backend-signed voucher.
     * @param recipient The address of the player claiming the rewards. Must match msg.sender.
     * @param amount The amount of USDm to claim.
     * @param nonce A unique nonce to prevent double claiming.
     * @param expiresAt The timestamp when the voucher expires (0 for no expiry).
     * @param signature The EIP-191 signature signed by the backend signer.
     */
    function claim(
        address recipient,
        uint256 amount,
        uint256 nonce,
        uint256 expiresAt,
        bytes calldata signature
    ) external nonReentrant {
        // Checks
        require(recipient == msg.sender, "Caller is not the recipient");
        require(expiresAt == 0 || block.timestamp <= expiresAt, "Voucher expired");
        require(!usedNonces[nonce], "Nonce already used");
        require(totalPayouts + amount <= maxTotalPayout, "Global payout pool limit exceeded");

        uint256 dayIndex = block.timestamp / 1 days;
        require(claimedToday[recipient][dayIndex] + amount <= maxDailyPayoutPerUser, "Daily user payout limit exceeded");

        // Verify Signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(recipient, amount, nonce, expiresAt, address(this))
        );
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        require(ethSignedMessageHash.recover(signature) == signer, "Invalid signature");

        // Effects
        usedNonces[nonce] = true;
        claimedToday[recipient][dayIndex] += amount;
        totalPayouts += amount;

        emit RewardClaimed(recipient, amount, nonce, dayIndex);

        // Interactions
        token.safeTransfer(recipient, amount);
    }

    // Owner Functions

    function setToken(address newToken) external onlyOwner {
        require(newToken != address(0), "Invalid token address");
        emit TokenUpdated(address(token), newToken);
        token = IERC20(newToken);
    }

    function setSigner(address newSigner) external onlyOwner {
        require(newSigner != address(0), "Invalid signer address");
        emit SignerUpdated(signer, newSigner);
        signer = newSigner;
    }

    function setMaxDailyPayoutPerUser(uint256 newLimit) external onlyOwner {
        emit MaxDailyPayoutPerUserUpdated(maxDailyPayoutPerUser, newLimit);
        maxDailyPayoutPerUser = newLimit;
    }

    function setMaxTotalPayout(uint256 newMax) external onlyOwner {
        emit MaxTotalPayoutUpdated(maxTotalPayout, newMax);
        maxTotalPayout = newMax;
    }

    function withdrawToken(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient address");
        emit TokensWithdrawn(to, amount);
        token.safeTransfer(to, amount);
    }
}
