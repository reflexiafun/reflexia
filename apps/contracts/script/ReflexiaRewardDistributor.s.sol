// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {ReflexiaRewardDistributor} from "../src/ReflexiaRewardDistributor.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock USDm", "USDm") {
        _mint(msg.sender, 1_000_000 * 10**18);
    }
}

contract DeployReflexiaRewardDistributor is Script {
    function run() external {
        vm.startBroadcast();
        address deployer = msg.sender;

        address tokenAddress;
        if (block.chainid == 42220) {
            tokenAddress = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
            console2.log("Using Real USDm token at:", tokenAddress);
        } else {
            // Deploy Mock USDm Token
            MockERC20 token = new MockERC20();
            tokenAddress = address(token);
            console2.log("Mock USDm deployed at:", tokenAddress);
        }

        // Use the first account as signer
        address signerAddress = vm.envOr("SIGNER_ADDRESS", deployer);
        console2.log("Signer address set to:", signerAddress);
        
        // Limits
        uint256 maxDailyPayoutPerUser = 100 * 10**18; // 100 USDm
        uint256 maxTotalPayout = 10000 * 10**18; // 10,000 USDm

        ReflexiaRewardDistributor distributor = new ReflexiaRewardDistributor(
            tokenAddress,
            signerAddress,
            maxDailyPayoutPerUser,
            maxTotalPayout
        );
        console2.log("Distributor deployed at:", address(distributor));

        // Fund the distributor with some USDm (only for local/testnet tests)
        if (block.chainid != 42220) {
            MockERC20(tokenAddress).transfer(address(distributor), 10000 * 10**18);
            console2.log("Funded distributor with 10,000 USDm");
        } else {
            console2.log("Please fund the distributor contract manually with real USDm tokens.");
        }

        vm.stopBroadcast();
    }
}
