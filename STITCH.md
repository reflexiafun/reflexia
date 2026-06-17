# Reflexia - Design & Implementation Prompt for Stitch

This document defines the comprehensive frontend prompt and design specification for **Reflexia**, a cute pastel-themed casual reflex and reward game, formatted for direct consumption by Stitch / Frontend Generator tools.

---

## 1. System Prompt & Instructions for Stitch

You are tasked with building the frontend for **Reflexia**, a cute, fast-paced reflex mini-game for casual mobile/web browsers. The theme is **"Cute Pastel / Web3 Casual"**—visuals must be soft, colorful, rounded, bouncy, and highly interactive.

### 🏛️ Architecture & Setup
- **Core Technology**: Single-page interactive application built using HTML5, CSS3, and modern ES6 JavaScript.
- **Framework Option**: Next.js, React, Tailwind CSS. Use beautiful CSS transitions, keyframe animations, and custom utility classes.
- **Responsiveness**: Mobile-first design, optimized for portrait aspect ratio (9:16) but fully centered and responsive on desktop displays with a charming device frame or cloud-themed background.
- **Web3 / MiniPay Integration**: 
  - Built for MiniPay on Celo stablecoin rails.
  - Micro-rewards in USDm directly to MiniPay (Celo address).
  - Users can swap their USDm to USDT/USDC using MiniPay Pockets.
- **Persistence**: Save player progress (XP, Points, Unlocked Skins, Daily Rewards claimed state, High Score) in `localStorage`.

---

## 2. Visual Identity & Design Tokens

Use these design rules strictly to ensure a premium, unified aesthetic:

### 🎨 Color Palette (Pastel Dream)
- **Primary Pink (Cotton Candy)**: `hsl(340, 100%, 88%)` / `#FFC0CB`
- **Secondary Blue (Sky Bubble)**: `hsl(200, 100%, 85%)` / `#ADD8E6`
- **Sunny Yellow (Honeybee)**: `hsl(50, 100%, 80%)` / `#FFF2B2`
- **Mint Green (Friendly Clover)**: `hsl(145, 60%, 85%)` / `#C1F8D2`
- **Lavender Purple (Magic Cloud)**: `hsl(270, 70%, 90%)` / `#E8D3FF`
- **Soft Text/Ink**: `hsl(240, 30%, 25%)` (Never use pitch black `#000000`)
- **Background Gradient**: `linear-gradient(180deg, #E8D3FF 0%, #ADD8E6 100%)` (A dreamy cloud transition)

### 📐 Typography & Shapes
- **Primary Font**: `Fredoka` or `Quicksand` (Google Fonts) – rounded, soft, friendly, and highly readable.
- **Border Radius**: Super-curved corners (`border-radius: 24px` to `36px` or Tailwind `rounded-3xl` / `rounded-[2.5rem]`).
- **Shadows**: Smooth, offset, low-opacity shadows (`box-shadow: 0 8px 24px rgba(0,0,0,0.06)`).
- **Borders**: Chunky but soft borders (e.g., `4px solid white` or `4px solid rgba(255,255,255,0.8)`) to give it a sticker/claymorphism feel.

### ✨ Animations (Micro-interactions)
- **Bounce Intro**: `@keyframes bounceIn` for modals and cards.
- **Hover/Active State**: Shrink slightly on active click/tap (`transform: scale(0.95)`) and bounce slightly on hover (`transform: translateY(-4px)`).
- **Float Effect**: Gentle up-and-down floating for main mascots (`@keyframes float`).
- **Target Spawn**: Scaled from 0 to 1 with an overshoot elastic effect (`transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)`).

---

## 3. Screen Flows & UI Components

### 📱 1. Splash / Loading Screen
*   **Layout**: Centered cute cloud layout with a mascot (a sleeping baby star or smiley bunny).
*   **Components**:
    *   Logo: **Reflexia** written in colorful, bouncy, bubble-style typography.
    *   Loading Bar: A track shaped like a track of clouds, filled with a pink candy bar.
    *   Status Text: *"Waking up the stars..."*, *"Polishing the cloud steps..."*
*   **Logic**: Auto-transition to the Home Screen after 2.5 seconds.

### 🏠 2. Home Menu Screen
*   **Layout**: Top bar with player stats, center mascot, bottom primary actions.
*   **Components**:
    *   **Header Bar**:
        *   Left: Avatar profile (small circle with mascot, level badge like "Lv. 1").
        *   Right: Points/Coins display (`⭐ 1,250`) with a shiny spin effect on update.
    *   **Center Character (Interactive Mascot)**:
        *   A cute bunny or star that reacts with a bubble text and plays a wiggle animation when clicked.
    *   **Action Buttons**:
        *   **PLAY BUTTON** (Large, bouncy, sunny yellow with "Tap to Play" icon).
        *   **SHOP BUTTON** (Lavender with shopping bag icon).
        *   **DAILY REWARDS BUTTON** (Mint green with reward box icon).
        *   **TUTORIAL BUTTON** (Info sign to trigger the overlay).

### 📖 3. Tutorial Overlay Modal
*   **Layout**: Semi-transparent backdrop with a centered storybook card.
*   **Components**:
    *   **Step 1**: "Tap the happy targets!" (Shows smiling Star and Cloud target icons).
    *   **Step 2**: "Avoid the grumpy targets!" (Shows angry storm cloud or grumpy balloon).
    *   **Step 3**: "Tap as fast as you can to build a Combo Multiplier!"
    *   **Action**: A prominent "Let's Go!" button to close and start.

### 🎮 4. Game Screen
*   **Layout**: Fixed-ratio game canvas area. Top HUD, center spawning arena, bottom combo meter.
*   **Components**:
    *   **HUD (Top Bar)**:
        *   Home Button (back to main menu).
        *   Score Counter: Dynamic scaling bubble.
        *   Timer Progress Bar: A cute pastel pink candy bar that shrinks from right to left (15 seconds).
    *   **Spawning Area (Canvas)**:
        *   A grid-less field where cute targets spawn dynamically.
    *   **Combo/Streak Badge**: Shows `Streak x5` with active fire/rainbow glow particles.

### 🏆 5. Result Screen
*   **Layout**: Banner header, score breakdown card, stars reward display, navigation buttons.
*   **Components**:
    *   **Star Rating**: 1, 2, or 3 cute cartoon stars lighting up.
    *   **Stats Card**: Displays Final Score, Accuracy, Max Streak, and Earned Points.
    *   **USDm Milestone / Lucky Draw Button**: If they score >= 8 targets, show a glowing *"Claim Reward Chest!"* button.
    *   **Navigation**:
        *   "Play Again" (Primary action).
        *   "Back to Home".

### 🎁 6. Daily Rewards Screen
*   **Layout**: Beautiful pastel pink grid layout showing a 7-day reward cycle.
*   **Components**:
    *   7-day timeline or grid cards with pastel reward badges (USDm values and Stars).
    *   Confetti canvas trigger upon successful claim.
    *   Claim status tags (e.g. "Claimed ✔️", "Locked 🔒").
    *   **Claim Today** call-to-action button, which disables to **Come back tomorrow** once claimed.

### 🛍️ 7. Shop / Cosmetics Screen
*   **Layout**: Header bar, item grid (2x3 format), bottom character preview.
*   **Components**:
    *   **Preview Area**: Shows current character skin.
    *   **Item Card**: Image of the skin, cost (e.g. `⭐ 500`), and status ("Buy", "Equip", "Equipped").

---

## 4. Game Rules & Logic Specifications

1.  **Game Settings**:
    *   Round duration: 15 seconds.
    *   Max target lifetime: 1.5 seconds.
2.  **Reward Eligibility**:
    *   Score 0–4: No chest reward.
    *   Score 5–7: Tiny chest (+15 stars).
    *   Score >= 8: Golden chest (+30 stars + eligible for USDm gameplay claim).
3.  **Daily Rewards Logic**:
    *   Day 1: 0.0001 USDm + 1 star
    *   Day 2: 0.0002 USDm + 2 stars
    *   Day 3: 0.0003 USDm + 3 stars
    *   Day 4: 0.0005 USDm + 4 stars
    *   Day 5: 0.0007 USDm + 5 stars
    *   Day 6: 0.0010 USDm + 7 stars
    *   Day 7: 0.0020 USDm + 10 stars + bonus chest
    *   Cycle resets to Day 1 after Day 7 or if a day is missed.
