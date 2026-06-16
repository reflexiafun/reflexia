// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {ReflexiaRewardDistributor} from "../src/ReflexiaRewardDistributor.sol";

contract DeployReflexiaRewardDistributor is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0xA11CE));
        
        // Target settings (replace or load from env)
        address tokenAddress = vm.envOr("USDM_TOKEN_ADDRESS", address(0x1)); 
        address signerAddress = vm.envOr("SIGNER_ADDRESS", address(0x2));
        
        // Limits
        uint256 maxDailyPayoutPerUser = 100 * 10**18; // 100 USDm
        uint256 maxTotalPayout = 10000 * 10**18; // 10,000 USDm

        vm.startBroadcast(deployerPrivateKey);

        new ReflexiaRewardDistributor(
            tokenAddress,
            signerAddress,
            maxDailyPayoutPerUser,
            maxTotalPayout
        );

        vm.stopBroadcast();
    }
}
