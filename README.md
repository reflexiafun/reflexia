# Reflexia

Reflexia is a fast-paced reflex mini-game built on Celo stablecoin rails, designed specifically for MiniPay. The game challenges players to tap correct targets as quickly as possible before they disappear or change, featuring a **cute pastel / Web3 casual** visual theme with soft bright colors, cute characters, gentle animations, and a welcoming user experience.

> **Reflexia is a fast-paced casual game built specifically for MiniPay on Celo stablecoin rails, delivering instant micro-rewards in USDm directly to players' Celo wallets. By focusing on pure gameplay and high-retention tapping challenges, it offers a secure and abuse-resistant rewards loop free from complex DeFi mechanisms. Winners can seamlessly swap their USDm rewards to USDT or USDC via MiniPay Pockets, providing a friction-free Web3 user experience tailored for casual mobile audiences.**

[![Reflexia Gameplay Preview](https://img.youtube.com/vi/Yd4x1hMxqZM/maxresdefault.jpg)](https://youtu.be/Yd4x1hMxqZM?si=apWkLqC__Vbl76o6)

---

## 🎮 Core Gameplay

1. **Start the Game**: The player initiates the round.
2. **Tap Targets**: Cute targets (smiling stars, colorful clouds, chicks, bunnies, candies, or balloons) appear randomly on the screen.
3. **Avoid Fake Targets**: Players must quickly tap correct targets and avoid fake targets within 10–30 seconds.
4. **Scoring**: Points are calculated based on speed, accuracy, and streak.
5. **Claim Rewards**: Meeting minimum score thresholds triggers a Celo network transaction, sending USDm rewards directly to the player.

---

## 💎 Reward Design & Web3 Integration

- **Celo Stablecoin Rails**: All rewards are paid in **USDm** directly to players' Celo/MiniPay wallets via a smart contract `claimReward` flow.
- **Seamless Swap**: Players can swap their USDm rewards to USDT or USDC via MiniPay Pockets.
- **Abuse Prevention**: Zero complex DeFi mechanisms (no staking or yield) to maintain pool stability and prevent sybil/abuse.
- **Reward Tiers**:
  - **Score 0–4**: No reward.
  - **Score 5–7**: Small points-only reward.
  - **Score 8–10**: Eligible for small USDm claim.
  - **5-Win Streak**: Bonus chest.
  - **7-Day Login**: Cosmetic unlock.

---

## 🔗 Deployed Contracts

- **Distributor (Celo Mainnet)**: [`0x31232879882fD7369C6E48D98dA75cc68653ef06`](https://celoscan.io/address/0x31232879882fD7369C6E48D98dA75cc68653ef06)

---

## 🛠️ Tech Stack

- **Monorepo Management**: [Turborepo](https://turbo.build/)
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Package Manager**: [PNPM](https://pnpm.io/)
- **Blockchain Rails**: [Celo Network](https://celo.org/) (MiniPay, USDm)

---

## 📂 Project Structure

This monorepo is managed by Turborepo:

- `apps/web`: The Next.js application containing the game client, Web3 connections, page views, and assets.

---

## 🚀 Getting Started

### 1. Install Dependencies
Ensure you have `pnpm` installed, then run:
```bash
pnpm install
```

### 2. Start the Development Server
Run the local development server:
```bash
pnpm dev
```

### 3. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

- `pnpm dev`: Start the Next.js development server.
- `pnpm build`: Build the application for production.
- `pnpm lint`: Lint the codebase.
- `pnpm type-check`: Run TypeScript compilation check.
