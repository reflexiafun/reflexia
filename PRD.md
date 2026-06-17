# Product Requirements Document (PRD) - Reflexia (Daily Rewards Update)

## 1. Product Overview
Reflexia is a fast-paced, cute, and casual mobile-first reflex game designed for the MiniPay ecosystem on the Celo network. Players tap targets, build streaks, and avoid traps in quick 15-second rounds. Reflexia features a cheerful kid-themed pastel aesthetic and integrates Web3 micropayments by offering instant USDm claims on Celo rails, paired with off-chain progression (Stars) to customize their gameplay experience.

---

## 2. Goals
- **Gameplay Goal**: Offer a simple, extremely responsive, and satisfying reflex challenge that anyone can pick up and enjoy within seconds.
- **Retention Goal**: Encourage daily play through a 7-day Daily Rewards cycle, offering players incremental USDm and Star rewards.
- **Web3 Integration Goal**: Provide sponsored (gasless) USDm micro-claims directly to Celo wallets via MiniPay.

---

## 3. Target Users
- **Casual Mobile Users**: Players seeking quick 10–30 second entertainment loops.
- **MiniPay Users**: Ecosystem members interested in micro-earnings and interactive stablecoin features on Celo.
- **Hackathon MVP Audience**: Users evaluating clean, mobile-first Web3 UX design and rapid execution.

---

## 4. Core Gameplay
Reflexia revolves around a fast, repeatable gameplay loop:
1. **Initiate Game**: Player taps "Play Now!" to trigger a Lucky Box Spin that reveals 3 forbidden trap emojis.
2. **Action Phase**: For 15 seconds, cute target emojis (stars, clouds, balloons) spawn dynamically.
3. **Reflex Challenge**: Players tap correct targets to build streak multipliers and score points. Tapping forbidden traps or missing targets breaks the streak and deducts points.
4. **Reward Screen**: Displays final score, accuracy, stars earned, and allows claiming USDm for performance if eligibility criteria are met.

---

## 5. Reward System
Reflexia combines on-chain and off-chain rewards:
- **USDm (On-chain Stablecoin)**: The primary Web3 reward on Celo rails. Users can claim USDm directly to their MiniPay wallets. USDm is easily swappable to USDT or USDC via MiniPay Pockets.
- **Stars (Off-chain Progression)**: Earned through regular gameplay and daily rewards. Stars serve as soft currency used to purchase cosmetic themes/skins in the in-game shop.
- **Rationale**: On-chain rewards drive economic interest, while off-chain cosmetic progression keeps users engaged without causing a drain on the reward pool.

---

## 6. Daily Rewards Feature
The Daily Rewards system replaces the global leaderboard as the primary driver of user retention. It provides a simple, zero-setup reward claim mechanism based on consecutive login days.

### 7-Day Reward Cycle
| Day | USDm Payout | Star Payout | Special Reward |
| :--- | :--- | :--- | :--- |
| **Day 1** | 0.0001 USDm | 1 Star | - |
| **Day 2** | 0.0002 USDm | 2 Stars | - |
| **Day 3** | 0.0003 USDm | 3 Stars | - |
| **Day 4** | 0.0005 USDm | 4 Stars | - |
| **Day 5** | 0.0007 USDm | 5 Stars | - |
| **Day 6** | 0.0010 USDm | 7 Stars | - |
| **Day 7** | 0.0020 USDm | 10 Stars | Bonus Chest 🎁 |

### Rules
- **Frequency**: 1 claim per calendar day.
- **Consecutive Claims**: Resets back to Day 1 after Day 7 is claimed, or if a user misses a daily claim.

---

## 7. UX / UI Changes
- **Home Screen**: Remove the "🏆 Leaderboard" button and replace it with a prominent "🎁 Daily Rewards" or "Daily Claims" button.
- **Daily Rewards View**: Displays a dedicated cute layout featuring:
  - A 7-day progress timeline/grid using pastel icons.
  - Distinct active, locked, and claimed day states.
  - A call-to-action button: **Claim Today** (active) or **Come back tomorrow** (disabled, when claimed).
- **Theme**: Cute kid aesthetic with pastel pinks, baby blues, rounded elements, and playful micro-animations.

---

## 8. Feature Scope
### MVP Scope
- 15-second core reflex gameplay mode.
- Local high-score and total games tracking.
- Cosmetic shop for changing game emojis using Stars.
- 7-Day Daily Rewards claim flow (USDm and Stars).
- Web3 sponsored wallet integration (USDm claims).

### Non-MVP Scope (Future Iterations)
- Global leaderboard and competitive rankings.
- Social sharing, invite bonuses, and friend lists.
- Advanced wallet staking/yield DeFi integrations.

---

## 9. Smart Contract Role
The smart contract operates purely as an on-chain reward distributor:
- **Sponsored claims**: The distributor verifies off-chain generated vouchers (signed by the backend developer wallet) and sends USDm to the recipient address.
- **Gasless experience**: The backend pays the gas fees to submit claims.
- **progression limits**: User progression, Star balances, and cosmetic item unlocks remain strictly off-chain/local in the MVP.

---

## 10. Acceptance Criteria
- Users can view and understand their Daily Reward status within seconds.
- Day 7 reward displays a distinctive bonus chest animation/celebration.
- The app functions entirely without dependencies on a shared ranking backend database.
- Confetti and audio feedback triggers when claiming a daily reward.

---

## 11. UX Copy Suggestions
- **Tombol Daily Rewards**: `Daily Rewards` / `Daily Claim 🎁`
- **Claim Action**: `Claim Today!`
- **Claimed/Disabled State**: `Come back tomorrow` / `Already Claimed`
- **Day 7 Special**: `Day 7 Bonus Chest!`
- **Reward Confirmation**: `10 Stars earned!` / `USDm sent to your wallet!`