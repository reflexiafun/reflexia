Here is the PRD for **Reflexia** with a **cute pastel / Web3 casual** theme. I focused on game design, UX, and the reward loop so you can use it directly to build the game. [uxplanet](https://uxplanet.org/mobile-game-design-5-impressive-examples-for-ui-designers-3239e6d88a8a)

## 1. Product Summary

Reflexia is a fast-paced reflex mini-game that challenges players to tap cute targets as quickly as possible before they disappear or change. The visual theme is designed to be **cute pastel**: filled with soft bright colors, cute characters, gentle animations, and a UI that feels safe and welcoming for all casual players. The game is suitable for short play sessions of 10–30 seconds per round, after which players can earn points, items, or small performance-based rewards. [youtube](https://www.youtube.com/watch?v=Bt6cdA1w_no)

## 2. Product Objectives

The main goal of this game is to create a simple, fun, and highly replayable reflex experience without feeling heavy or overwhelming. From a product perspective, the game must have a clear retention loop: play quickly, get a score, level up, unlock skins, and repeat. The reward system must be balanced so that prizes feel attractive but remain secure against abuse. [gamedeveloper](https://www.gamedeveloper.com/design/game-design-theory-applied-a-layered-rewards-system)

## 3. Target Users

The primary target audience is casual mobile players ranging from teenagers to young adults who enjoy simple games, bright colors, and instant rewards. Because of the cute pastel / Web3 casual theme, the UI must be friendly, non-aggressive, and easy to understand within the first 5 seconds. The game is also suitable for users who enjoy daily mini-challenges and light leaderboards. [canva](https://www.canva.com/templates/s/game/)

## 4. Core Gameplay

Core Gameplay:
1. The player presses the start button.
2. Cute targets appear randomly on the screen.
3. The player must tap the target before the time runs out.
4. The score is calculated based on speed, accuracy, and streak.
5. If the minimum score is reached, the player receives a reward or points. [play.google](https://play.google.com/store/apps/details?id=com.aloneaarrow.reflexpush&hl=id)

Examples of target variations:
- A small smiling star.
- Colorful clouds.
- A chick, bunny, or candy.
- A balloon that appears and disappears quickly.
- Fake targets that must be avoided to add a challenge. [play.google](https://play.google.com/store/apps/details?id=com.HSGaming.Reflection&hl=hi)

## 5. Visual Direction

The visual direction should be cheerful, soft, and easy to read. Use a pastel palette such as light pink, sky blue, soft yellow, and mint, with sufficient contrast for main buttons. Element shapes should be rounded with soft shadows and small bounce animations to keep it playful. [dribbble](https://dribbble.com/search/game-ui-children)

Style guidelines:
- Use a cute mascot character as a guide.
- Avoid colors that are too dark or neon.
- Use large icons and short text.
- All main buttons must have clear affordance.
- Animations must be smooth, not too fast or sharp. [uxplanet](https://uxplanet.org/mobile-game-design-5-impressive-examples-for-ui-designers-3239e6d88a8a)

## 6. Screen List

Main screens needed:
- Splash / loading.
- Home menu.
- Short tutorial.
- Game screen.
- Result screen.
- Reward / claim screen.
- Shop / cosmetics.
- Daily leaderboard.
- Profile / stats. [dev](https://dev.to/ryanvanbelkum/building-a-mobile-game-using-react-native-3320)

## 7. UI Components

Core UI Components:
- Large primary buttons with rounded corners.
- Cute progress bar for the timer.
- Target cards with pop animations.
- Score bubbles for real-time points.
- Streak badges.
- Reward modals.
- Mini mascot avatars.
- Daily challenge cards. [dribbble](https://dribbble.com/search/game-ui-children)

Design principles:
- Each screen must focus on a single primary action.
- Minimize text.
- Use a clear hierarchy: target, timer, score, then reward.
- Feedback must be immediately visible after a correct or incorrect tap. [gamedeveloper](https://www.gamedeveloper.com/design/game-design-theory-applied-a-layered-rewards-system)

## 8. Reward Design

The reward system should be tiered:
- Normal play = points.
- Reaching specific scores = bonus points.
- Daily streaks = chest rewards.
- Weekly leaderboard = additional rewards.
- USDm claims only for specific milestones, not for every round. [adiccionesconductuales.som360](https://adiccionesconductuales.som360.org/en/articulo/role-video-game-design-addiction)

Examples:
- Score 0–4: no reward.
- Score 5–7: very small, points only.
- Score 8–10: eligible for small claim.
- 5 win streak: bonus chest.
- 7-day login: cosmetic unlock. [gamedeveloper](https://www.gamedeveloper.com/design/game-design-theory-applied-a-layered-rewards-system)

## 9. MVP Scope

Most realistic MVP scope:
- 1 reflex game mode.
- 1 mascot.
- 1 scoreboard.
- 1 daily reward loop.
- 1 simple cosmetic shop.
- 1 light leaderboard. [dev](https://dev.to/ryanvanbelkum/building-a-mobile-game-using-react-native-3320)

Not needed for MVP:
- Multiple modes.
- Multiple characters.
- Complex marketplace.
- 3D animations.
- Overly large economy. [gamedeveloper](https://www.gamedeveloper.com/design/game-design-theory-applied-a-layered-rewards-system)

## 10. Acceptance Criteria

The game is considered MVP-ready if:
- Users can understand how to play in less than 10 seconds.
- 1 round finishes in 10–30 seconds.
- The UI remains comfortable on mobile.
- Rewards feel attractive but are not easy to exploit.
- The cute pastel / Web3 casual theme is consistent across all screens. [uxplanet](https://uxplanet.org/mobile-game-design-5-impressive-examples-for-ui-designers-3239e6d88a8a)

## 11. Example Copy Directions

Example copy tone:
- “Tap the cute star!”
- “Beat your reflex!”
- “You got 8 points, nice!”
- “Come back tomorrow for a bonus!”
- “Unlock a new baby sticker!”  

## 12. Web3 & MiniPay Integration (Celo Rails)

The game is designed with the following Web3 specifications:
- **Celo Stablecoin Rails**: All on-chain rewards use USDm as the primary stablecoin on the Celo network.
- **UX Copy**: Players see rewards as "Dollars (USDm)" with a note explaining that the balance can be swapped to USDT or USDC via MiniPay Pockets.
- **Smart Contract Flow**: The reward pool contains USDm, the `claimReward` function sends USDm to the user's Celo/MiniPay address, and MiniPay handles the swap to USDT/USDC if desired by the user.
- **DeFi Disclaimer**: No staking, yield, or complex DeFi mechanisms are used, to maintain reward pool stability and prevent exploitation (sybil/abuse).

## 13. Pitch to Proof of Ship (USDm Wording)

> **Reflexia is a fast-paced casual game built specifically for MiniPay on Celo stablecoin rails, delivering instant micro-rewards in USDm directly to players' Celo wallets. By focusing on pure gameplay and high-retention tapping challenges, it offers a secure and abuse-resistant rewards loop free from complex DeFi mechanisms. Winners can seamlessly swap their USDm rewards to USDT or USDC via MiniPay Pockets, providing a friction-free Web3 user experience tailored for casual mobile audiences.**

*(Note: Hackathon prize pool from Proof of Ship is still paid in USDT to the developer).*