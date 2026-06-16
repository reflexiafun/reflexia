"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { useReward } from "partycles";

// Sound effects using Web Audio API
const playSound = (type: "start" | "tap" | "fail" | "win" | "click" | "spin" | "spin-tick") => {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "tap") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "start") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.setValueAtTime(400, now + 0.1);
      osc.frequency.setValueAtTime(600, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "fail") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "win") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "spin") {
      // Swirling low-to-high whoosh
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.5);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "spin-tick") {
      // Very short high-pitched click
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (e) {
    console.error("Audio Context failed", e);
  }
};

type ScreenType =
  | "splash"
  | "home"
  | "tutorial"
  | "game"
  | "result"
  | "reward"
  | "shop"
  | "leaderboard"
  | "profile"
  | "spin";

interface Target {
  id: number;
  x: number; // percentage
  y: number; // percentage
  emoji: string;
  isFake: boolean;
  size: number; // px
}

interface FlyingIcon {
  id: number;
  emoji: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  size: number;
}


const SKIN_THEMES = [
  { id: "default", name: "Cute Pastel ⭐", price: 0, emojis: ["⭐", "☁️", "🎈", "🐰", "🐥", "🌸", "🦄", "🧸", "🍦", "🎀"] },
  { id: "candy", name: "Candy Party 🍭", price: 250, emojis: ["🍭", "🍬", "🍩", "🧁", "🍫", "🍪", "🍿", "🍯", "🍧", "🍮"] },
  { id: "space", name: "Cosmic Baby 🚀", price: 500, emojis: ["🚀", "🪐", "🛸", "☄️", "👾", "🌟", "🛰️", "👽", "🌙", "🌍"] },
  { id: "animal", name: "Safari Friends 🦁", price: 1000, emojis: ["🦁", "🐼", "🐨", "🐸", "🦊", "🐯", "🦒", "🦓", "🐵", "🐘"] },
];

const FORBIDDEN_EMOJI_POOL = [
  "💣", "💥", "☠️", "👻", "💩", "👾", "👿", "🌀", "🕸️", "☣️", "☢️", "👽", "👹", "👺", "🃏",
  "💀", "🧟", "🧛", "🧙", "🧌", "🌋", "🌪️", "⚡", "🔥", "⚔️", "🔪", "⛓️", "🕷️", "🦂", "🐍",
  "🦟", "🪳", "🪰", "🪲", "⚰️", "🪦", "🔮", "🩹"
];

const MASCOT_EMOJIS = ["🐹", "🐱", "🐶", "🦊", "🦁", "🐯", "🐻", "🐼", "🐨", "🐰", "🦄", "🐸", "🐷", "🐧", "🐥", "🐣", "🐵", "🐨", "🐺", "🐿️"];

// Theme-consistent pastel bg colors for the mascot circle
const MASCOT_BG_COLORS = [
  "#ffd9df", // soft pink (default)
  "#f0e3a4", // warm yellow
  "#c8e6d4", // sage green
  "#c5dce8", // sky blue
  "#dbd3f0", // lavender
  "#f5d4c0", // peach
  "#d4ecf7", // baby blue
  "#fce4c8", // apricot
  "#e4d4ec", // soft purple
  "#cde8e0", // mint
];

const COOL_SENTENCES = [
  "Ready, set, tap! 🚀",
  "Show me your lightning-fast reflex! ⚡",
  "Focus hard, tap faster! 🔥",
  "Can you go any faster? 😏",
  "Unleash your tapping skills! 🎮",
  "Reach for the highest score! 🏆",
  "Keep your eyes sharp and hands quick! 👀",
  "Don't tap the wrong target! ❌",
  "Test your limits today! ⏱️",
  "Super speed mode activated! ⚡",
  "Maximum reflexes or snail mode? 🐌",
  "Tap like a true champion! 🏆",
  "Maximum concentration needed! 🧠",
  "Get ready for finger gymnastics! 😂",
  "Break your own limits! 🚀",
  "Watch out for the traps! ❌",
  "Become the ultimate reflex master! 👑",
  "Don't blink for a single second! 👁️",
  "Speed is the key to victory! 🔑",
  "Beat the high score! 🔥"
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const [activeScreen, setActiveScreen] = useState<ScreenType>("splash");
  const [stars, setStars] = useState(50);
  const [highScore, setHighScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [streakDays, setStreakDays] = useState(1);
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(["default"]);
  const [selectedSkin, setSelectedSkin] = useState<string>("default");
  const [mounted, setMounted] = useState(false);
  const [loadedAddress, setLoadedAddress] = useState<string | null>(null);
  const [mascotEmoji, setMascotEmoji] = useState("🐹");
  const [mascotBgColor, setMascotBgColor] = useState(MASCOT_BG_COLORS[0]);
  const [forbiddenEmojis, setForbiddenEmojis] = useState<string[]>(["💣", "☠️", "👻"]);
  const [spinEmojis, setSpinEmojis] = useState<string[]>(["❓", "❓", "❓"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [settledBoxes, setSettledBoxes] = useState<boolean[]>([false, false, false]);

  const currentAddressKey = address || "guest";
  const storageKey = `reflexia_game_data_${currentAddressKey}`;

  // Load state from localStorage on mount and when address changes
  useEffect(() => {
    if (!mounted) return;

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setStars(typeof data.stars === 'number' ? data.stars : 50);
        setHighScore(typeof data.highScore === 'number' ? data.highScore : 0);
        setTotalGames(typeof data.totalGames === 'number' ? data.totalGames : 0);
        setStreakDays(typeof data.streakDays === 'number' ? data.streakDays : 1);
        setUnlockedSkins(Array.isArray(data.unlockedSkins) ? data.unlockedSkins : ["default"]);
        setSelectedSkin(typeof data.selectedSkin === 'string' ? data.selectedSkin : "default");
      } catch (e) {
        console.error("Failed to parse game data from localStorage", e);
      }
    } else {
      // Reset to defaults if no saved data for this address
      setStars(50);
      setHighScore(0);
      setTotalGames(0);
      setStreakDays(1);
      setUnlockedSkins(["default"]);
      setSelectedSkin("default");
    }
    setLoadedAddress(currentAddressKey);
  }, [address, mounted, storageKey, currentAddressKey]);

  // Save state to localStorage whenever state changes (only if it matches the currently loaded address)
  useEffect(() => {
    if (!mounted || loadedAddress !== currentAddressKey) return;

    const data = {
      stars,
      highScore,
      totalGames,
      streakDays,
      unlockedSkins,
      selectedSkin,
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [stars, highScore, totalGames, streakDays, unlockedSkins, selectedSkin, storageKey, mounted, loadedAddress, currentAddressKey]);

  const [bubbleText, setBubbleText] = useState("Let's test your reflex! ⚡");
  const [displayedBubbleText, setDisplayedBubbleText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Typing effect for the bubble text
  useEffect(() => {
    const chars = Array.from(bubbleText);
    let current = "";
    setDisplayedBubbleText("");
    if (chars.length === 0) return;

    setIsTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      current += chars[index];
      setDisplayedBubbleText(current);
      index++;
      if (index >= chars.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 45); // 45ms per character typing speed

    return () => clearInterval(interval);
  }, [bubbleText]);

  // Game state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15.0); // 15 seconds round
  const [gameActive, setGameActive] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [showTapIndicator, setShowTapIndicator] = useState<{ x: number; y: number; text: string } | null>(null);
  const [hasSpawnedAny, setHasSpawnedAny] = useState(false);
  const [splashProgress, setSplashProgress] = useState(0);
  const [flyingIcons, setFlyingIcons] = useState<FlyingIcon[]>([]);

  // Claim state
  const [claimStatus, setClaimStatus] = useState<"idle" | "claiming" | "claimed">("idle");
  const [txHash, setTxHash] = useState("");
  const [rewardAmount, setRewardAmount] = useState("0.005");

  const rewardRef = useRef<HTMLDivElement>(null);
  const { reward } = useReward(rewardRef, "coins", {
    particleCount: 25,
    spread: 60,
    startVelocity: 20,
    effects: { spin3D: true }
  });

  useEffect(() => {
    if (claimStatus === "claimed") {
      // Small delay to ensure the DOM element with rewardRef is rendered
      const timer = setTimeout(() => {
        reward();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [claimStatus, reward]);

  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const flyingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentTargetId = useRef(0);
  const gameActiveRef = useRef(false);

  // Auto transition from splash to home with progress bar
  useEffect(() => {
    if (!mounted) return;
    if (activeScreen === "splash") {
      setSplashProgress(0);
      const interval = setInterval(() => {
        setSplashProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Randomize mascot for this session
            const randomMascot = MASCOT_EMOJIS[Math.floor(Math.random() * MASCOT_EMOJIS.length)];
            setMascotEmoji(randomMascot);
            const randomText = COOL_SENTENCES[Math.floor(Math.random() * COOL_SENTENCES.length)];
            setBubbleText(randomText);
            setActiveScreen("home");
            return 100;
          }
          return prev + 1.5; // roughly 1.3s duration
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [activeScreen, mounted]);

  // Clean up timers on unmount
  useEffect(() => {
    setMounted(true);
    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (flyingTimerRef.current) clearInterval(flyingTimerRef.current);
    };
  }, []);

  const changeScreen = (screen: ScreenType) => {
    playSound("click");
    if (screen === "home") {
      const randomText = COOL_SENTENCES[Math.floor(Math.random() * COOL_SENTENCES.length)];
      setBubbleText(randomText);
    }
    setActiveScreen(screen);
  };

  const randomizeMascot = () => {
    playSound("click");
    const filtered = MASCOT_EMOJIS.filter((e) => e !== mascotEmoji);
    const randomMascot = filtered[Math.floor(Math.random() * filtered.length)];
    setMascotEmoji(randomMascot);
    const filteredColors = MASCOT_BG_COLORS.filter((c) => c !== mascotBgColor);
    setMascotBgColor(filteredColors[Math.floor(Math.random() * filteredColors.length)]);
    const randomText = COOL_SENTENCES[Math.floor(Math.random() * COOL_SENTENCES.length)];
    setBubbleText(randomText);
  };

  const exitGame = () => {
    playSound("click");
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (flyingTimerRef.current) clearInterval(flyingTimerRef.current);
    gameActiveRef.current = false;
    setGameActive(false);
    setTargets([]);
    setFlyingIcons([]);
    const randomText = COOL_SENTENCES[Math.floor(Math.random() * COOL_SENTENCES.length)];
    setBubbleText(randomText);
    setActiveScreen("home");
  };

  const startSpinPhase = () => {
    playSound("click");
    playSound("spin");
    setActiveScreen("spin");
    setIsSpinning(true);
    setSpinEmojis(["❓", "❓", "❓"]);
    setSettledBoxes([false, false, false]);

    // Find current active theme emojis
    const currentTheme = SKIN_THEMES.find((t) => t.id === selectedSkin) || SKIN_THEMES[0];

    // Filter forbidden emoji pool to NOT include current theme emojis
    const filteredPool = FORBIDDEN_EMOJI_POOL.filter(
      (e) => !currentTheme.emojis.includes(e)
    );

    // Pick 3 random unique emojis
    const chosen: string[] = [];
    const tempPool = [...filteredPool];
    for (let i = 0; i < 3; i++) {
      if (tempPool.length === 0) break;
      const randIdx = Math.floor(Math.random() * tempPool.length);
      chosen.push(tempPool.splice(randIdx, 1)[0]);
    }
    while (chosen.length < 3) {
      chosen.push("❌");
    }

    setForbiddenEmojis(chosen);

    let intervalCount = 0;
    const intervalTime = 80;

    const spinInterval = setInterval(() => {
      intervalCount += intervalTime;

      setSpinEmojis((prev) => {
        const next = [...prev];
        if (intervalCount < 1000) {
          next[0] = filteredPool[Math.floor(Math.random() * filteredPool.length)] || "❌";
        } else {
          next[0] = chosen[0];
        }

        if (intervalCount < 1600) {
          next[1] = filteredPool[Math.floor(Math.random() * filteredPool.length)] || "❌";
        } else {
          next[1] = chosen[1];
        }

        if (intervalCount < 2200) {
          next[2] = filteredPool[Math.floor(Math.random() * filteredPool.length)] || "❌";
        } else {
          next[2] = chosen[2];
        }

        return next;
      });

      const nextSettled = [
        intervalCount >= 1000,
        intervalCount >= 1600,
        intervalCount >= 2200
      ];

      const prevSettled0 = (intervalCount - intervalTime) >= 1000;
      const prevSettled1 = (intervalCount - intervalTime) >= 1600;
      const prevSettled2 = (intervalCount - intervalTime) >= 2200;

      // Play tap sound when each box settles
      if (nextSettled[0] && !prevSettled0) playSound("tap");
      if (nextSettled[1] && !prevSettled1) playSound("tap");
      if (nextSettled[2] && !prevSettled2) playSound("tap");

      setSettledBoxes(nextSettled);

      // Play tick sound for spinning boxes
      if (!nextSettled[2]) {
        const justSettled = (nextSettled[0] && !prevSettled0) || (nextSettled[1] && !prevSettled1);
        if (!justSettled) {
          playSound("spin-tick");
        }
      }

      if (intervalCount >= 2200) {
        clearInterval(spinInterval);
        setIsSpinning(false);
      }
    }, intervalTime);
  };

  // Start game loop
  const startGame = () => {
    playSound("start");
    setScore(0);
    setStreak(0);
    setTimeLeft(15.0);
    setTargets([]);
    setFlyingIcons([]);
    setHasSpawnedAny(false);
    gameActiveRef.current = true;
    setGameActive(true);
    setActiveScreen("game");

    // Spawn initial target
    spawnTarget();

    // Spawn timer interval (approximately every 800ms to 1200ms)
    spawnTimerRef.current = setInterval(() => {
      spawnTarget();
    }, 900);

    // Spawn flying icons (every 1.1s to 1.7s)
    flyingTimerRef.current = setInterval(() => {
      spawnFlyingIcon();
    }, 1300);

    // Main clock
    gameIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          endGame();
          return 0;
        }
        return Math.round((prev - 0.1) * 10) / 10;
      });
    }, 100);
  };

  const spawnTarget = () => {
    if (!gameActiveRef.current) return;

    // Get current skin emojis
    const currentTheme = SKIN_THEMES.find((t) => t.id === selectedSkin) || SKIN_THEMES[0];
    const isFake = Math.random() < 0.25; // 25% chance of fake target
    const randomEmoji = isFake
      ? (forbiddenEmojis[Math.floor(Math.random() * forbiddenEmojis.length)] || "❌")
      : currentTheme.emojis[Math.floor(Math.random() * currentTheme.emojis.length)];

    const newTarget: Target = {
      id: currentTargetId.current++,
      x: Math.max(10, Math.min(80, Math.random() * 90)),
      y: Math.max(10, Math.min(80, Math.random() * 90)),
      emoji: randomEmoji,
      isFake,
      size: Math.floor(Math.random() * 20) + 60, // 60px to 80px size
    };

    setTargets((prev) => [...prev, newTarget]);
    setHasSpawnedAny(true);

    // Automatically remove target after 1.5 seconds if not clicked
    setTimeout(() => {
      setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
    }, 1500);
  };

  const spawnFlyingIcon = () => {
    if (!gameActiveRef.current) return;

    const emojiPool = ["💫", "⚡", "🚀", "🛸", "👾", "☄️", "💨", "🏃", "🦄", "🕊️", "🐝", "🎈", "⚽", "🏀", "🏎️", "✈️", "✨", "🎯"];
    const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];

    // Path variations
    const pathType = Math.floor(Math.random() * 5);
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    if (pathType === 0) {
      // Left to Right
      startX = -15;
      startY = Math.random() * 100;
      endX = 115;
      endY = Math.random() * 100;
    } else if (pathType === 1) {
      // Right to Left
      startX = 115;
      startY = Math.random() * 100;
      endX = -15;
      endY = Math.random() * 100;
    } else if (pathType === 2) {
      // Top to Bottom
      startX = Math.random() * 100;
      startY = -15;
      endX = Math.random() * 100;
      endY = 115;
    } else if (pathType === 3) {
      // Bottom to Top
      startX = Math.random() * 100;
      startY = 115;
      endX = Math.random() * 100;
      endY = -15;
    } else {
      // Corner to Corner (4 variations)
      const cornerType = Math.floor(Math.random() * 4);
      if (cornerType === 0) {
        startX = -15; startY = -15;
        endX = 115; endY = 115;
      } else if (cornerType === 1) {
        startX = 115; startY = -15;
        endX = -15; endY = 115;
      } else if (cornerType === 2) {
        startX = -15; startY = 115;
        endX = 115; endY = -15;
      } else {
        startX = 115; startY = 115;
        endX = -15; endY = -15;
      }
    }

    const duration = Math.floor(Math.random() * 800) + 700; // 700ms to 1500ms
    const size = Math.floor(Math.random() * 15) + 40; // 40px to 55px

    const newIcon: FlyingIcon = {
      id: Date.now() + Math.random(),
      emoji: randomEmoji,
      startX,
      startY,
      endX,
      endY,
      duration,
      size,
    };

    setFlyingIcons((prev) => [...prev, newIcon]);

    // Automatically remove after the animation completes
    setTimeout(() => {
      setFlyingIcons((prev) => prev.filter((item) => item.id !== newIcon.id));
    }, duration + 100);
  };

  const handleFlyingIconTap = (icon: FlyingIcon, clickX: number, clickY: number) => {
    if (!gameActiveRef.current) return;

    playSound("win");
    const addedPoints = 3;
    setScore((prev) => prev + addedPoints);
    setStreak((prev) => prev + 2); // bonus streak boost
    setShowTapIndicator({ x: clickX, y: clickY, text: `+${addedPoints} Speed Bonus! ⚡` });

    // Remove tapped icon
    setFlyingIcons((prev) => prev.filter((i) => i.id !== icon.id));

    // Clear indicator after 600ms
    setTimeout(() => {
      setShowTapIndicator(null);
    }, 600);
  };


  const handleTargetTap = (target: Target, clickX: number, clickY: number) => {
    if (!gameActiveRef.current) return;

    if (target.isFake) {
      // Tapped a fake target! Penalize
      playSound("fail");
      setScore((prev) => Math.max(0, prev - 2));
      setStreak(0);
      setShowTapIndicator({ x: clickX, y: clickY, text: `-2 ${target.emoji} Oops!` });
    } else {
      // Good tap
      playSound("tap");
      const addedPoints = 1 + Math.floor(streak / 5);
      setScore((prev) => prev + addedPoints);
      setStreak((prev) => prev + 1);
      setShowTapIndicator({ x: clickX, y: clickY, text: `+${addedPoints} Streak! 🔥` });
    }

    // Remove tapped target
    setTargets((prev) => prev.filter((t) => t.id !== target.id));

    // Clear indicator after 600ms
    setTimeout(() => {
      setShowTapIndicator(null);
    }, 600);
  };

  const endGame = () => {
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (flyingTimerRef.current) clearInterval(flyingTimerRef.current);
    gameActiveRef.current = false;
    setGameActive(false);
    playSound("win");

    setTotalGames((prev) => prev + 1);
    setHighScore((prev) => (score > prev ? score : prev));

    // Calculate stars reward
    let rewardStars = 0;
    if (score >= 5 && score <= 7) rewardStars = 5;
    else if (score >= 8 && score <= 10) rewardStars = 15;
    else if (score > 10) rewardStars = 30;

    setStars((prev) => prev + rewardStars);
    setActiveScreen("result");
  };

  // Buy Skin
  const buySkin = (skinId: string, price: number) => {
    if (stars >= price && !unlockedSkins.includes(skinId)) {
      setStars((prev) => prev - price);
      setUnlockedSkins((prev) => [...prev, skinId]);
      setSelectedSkin(skinId);
      playSound("win");
    } else if (unlockedSkins.includes(skinId)) {
      setSelectedSkin(skinId);
      playSound("click");
    } else {
      playSound("fail");
    }
  };

  // Mock blockchain reward claim
  const handleClaimUSDm = () => {
    if (score < 8) return;
    playSound("click");
    setClaimStatus("claiming");

    // Simulate blockchain confirmation
    setTimeout(() => {
      setClaimStatus("claimed");
      setTxHash("0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(""));
      playSound("win");
    }, 3000);
  };

  return (
    <div className="flex-grow w-full max-w-[450px] mx-auto min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#fff8f7]">
      {/* Background clouds (Atmosphere) */}
      <div className="cloud w-64 h-32 top-20 -left-10 animate-float" style={{ animationDelay: "0s" }}></div>
      <div className="cloud w-48 h-24 top-60 -right-20 animate-float" style={{ animationDelay: "1s" }}></div>
      <div className="cloud w-80 h-40 bottom-20 left-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: "2s" }}></div>

      {/* Screen Container */}
      <div className="w-full flex flex-col items-center">
        {/* SPLASH SCREEN */}
        {activeScreen === "splash" && (
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 mb-8 flex items-center justify-center">
              <img src="/logo.png" alt="Reflexia Logo" className="w-full h-full object-contain" />
            </div>
            {/* Premium Progress Bar with Circular Decors */}
            <div className="relative w-80 mt-8 flex justify-center items-center">
              {/* Left circular decor */}
              <div className="absolute -left-3 w-8 h-8 rounded-full bg-white shadow-[0_4px_8px_rgba(0,0,0,0.05)] border-2 border-white z-0 flex items-center justify-center text-xs animate-pulse opacity-60">
                ✨
              </div>
              {/* Bottom circular decor */}
              <div className="absolute -bottom-4 left-1/4 w-6 h-6 rounded-full bg-white shadow-[0_4px_8px_rgba(0,0,0,0.05)] border-2 border-white z-0 animate-bounce-slow"></div>
              {/* Right circular decor */}
              <div className="absolute -right-3 w-10 h-10 rounded-full bg-white shadow-[0_4px_8px_rgba(0,0,0,0.05)] border-2 border-white z-0"></div>

              {/* Main premium glossy pill bar */}
              <div className="w-full bg-white border-[6px] border-white rounded-full p-0.5 shadow-[0_12px_24px_rgba(0,0,0,0.06),inset_0_4px_8px_rgba(0,0,0,0.05)] h-8 relative z-10 flex items-center overflow-hidden">
                <div
                  className="bg-[#ffd9df] border-2 border-[#ffc0cb] h-full rounded-full transition-all duration-75 relative shadow-[inset_0_4px_0_rgba(255,255,255,0.6)] animate-pulse-opacity"
                  style={{ width: `${splashProgress}%` }}
                >
                  {/* Glossy top glare overlay */}
                  <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/50 rounded-full"></div>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#81515a] font-bold mt-8 tracking-wide animate-pulse-opacity">
              {Math.floor(splashProgress)}% Loading...
            </p>
          </div>
        )}

        {/* HOME MENU */}
        {activeScreen === "home" && (
          <div className="w-full flex flex-col items-center">
            {/* Top Stars & Streak bar */}
            <div className="w-full flex flex-wrap justify-between gap-3 mb-6">
              <div className="flex-grow flex-shrink basis-[150px] bg-white px-4 py-2.5 rounded-2xl clay-card flex items-center justify-between gap-2 min-w-0">
                <span className="text-[#81515a] font-bold text-sm flex items-center gap-1 whitespace-nowrap">
                  <span>⭐</span> Stars
                </span>
                <span className="text-[#81515a] font-bold text-lg whitespace-nowrap">{stars}</span>
              </div>
              <div className="flex-grow flex-shrink basis-[170px] bg-[#f0e3a4] px-4 py-2.5 rounded-2xl clay-card flex items-center justify-between gap-2 min-w-0 border-2 border-white">
                <span className="text-[#201c00] font-bold text-sm flex items-center gap-1 whitespace-nowrap">
                  <span>🔥</span> Streak
                </span>
                <span className="text-[#201c00] font-bold text-lg whitespace-nowrap">{streakDays} Day</span>
              </div>
            </div>

            {/* Mascot and speech bubble */}
            <div className="relative mb-8 group w-full flex flex-col items-center">
              <div className="bg-white px-5 py-3 rounded-2xl clay-card whitespace-nowrap animate-float mb-6 relative">
                <span className="font-bold text-lg text-[#81515a] inline-flex items-center">
                  {displayedBubbleText}
                  <span className={`inline-block w-[3px] h-[18px] ml-1 bg-[#81515a] rounded-full ${isTyping ? "animate-pulse" : "opacity-0"}`} />
                </span>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-4 bg-white bubble-tail"></div>
              </div>
              <div
                onClick={randomizeMascot}
                className="w-48 h-48 rounded-full border-4 border-white flex items-center justify-center text-[115px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-500"
                style={{ backgroundColor: mascotBgColor }}
              >
                {mascotEmoji}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="w-full flex flex-col gap-3">
              <Button
                onClick={startSpinPhase}
                className="w-full py-7 text-xl font-bold bg-[#81515a] hover:bg-[#663a43] text-white rounded-2xl clay-button-primary"
              >
                Play Now! 🎮
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => changeScreen("shop")}
                  className="w-full py-5 font-bold bg-[#3a6470] hover:bg-[#214c58] text-white rounded-2xl clay-button-primary"
                >
                  🧸 Shop
                </Button>
                <Button
                  onClick={() => changeScreen("leaderboard")}
                  className="w-full py-5 font-bold bg-[#675f2d] hover:bg-[#4f4717] text-white rounded-2xl clay-button-primary"
                >
                  🏆 Leaderboard
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => changeScreen("profile")}
                  className="w-full py-4 font-semibold bg-[#e2d8d8] text-[#514345] hover:bg-[#eae0e0] rounded-2xl clay-card"
                >
                  🐱 Profile
                </Button>
                <Button
                  onClick={() => changeScreen("tutorial")}
                  className="w-full py-4 font-semibold bg-white text-[#81515a] hover:bg-slate-50 rounded-2xl clay-card"
                >
                  ❓ Help
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="w-full mt-8 flex flex-col items-center gap-2">
              {/* Divider */}
              <div className="w-full flex items-center gap-3 mb-1">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d5c2c4] to-transparent" />
                <span className="text-[#d5c2c4] text-xs">✦</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d5c2c4] to-transparent" />
              </div>

              {/* Brand name */}
              <p className="text-[#81515a] font-bold text-sm tracking-widest">
                Reflexia
              </p>

              {/* Year */}
              <p className="text-[#a08085] text-xs font-medium">© 2026 · All rights reserved</p>

              {/* Built on Celo badge */}
              <div className="flex items-center gap-2 bg-white border-2 border-[#f0e6e6] rounded-full px-4 py-1.5 shadow-sm mt-1">
                <img
                  src="https://coin-images.coingecko.com/coins/images/11090/large/InjXBNx9_400x400.jpg?1696511031"
                  alt="Celo"
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>
                  <span className="text-[#514345] text-xs font-semibold tracking-wide">Built on </span>
                  <span className="text-[#81515a] text-xs font-bold tracking-wide">Celo</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SPIN SCREEN */}
        {activeScreen === "spin" && (
          <div className="w-full bg-white p-6 rounded-3xl clay-card flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-[#81515a] mb-2">Lucky Box Spin! 🎁</h2>
            <p className="text-xs text-slate-500 mb-6 max-w-[280px]">
              {isSpinning
                ? "Spinning the boxes to reveal 3 forbidden emojis..."
                : "Remember these 3 emojis! Tapping them will deduct points!"}
            </p>

            {/* The 3 Slots */}
            <div className="flex gap-2 sm:gap-4 justify-center items-center mb-8 w-full">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#fff8f7] border-4 flex items-center justify-center text-3xl sm:text-4xl select-none transition-all duration-300 ${settledBoxes[idx]
                    ? "border-[#81515a] scale-105"
                    : "animate-pulse-slow scale-95 border-pink-200"
                    }`}
                >
                  <span className="drop-shadow-md">{spinEmojis[idx]}</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="w-full flex flex-col gap-3">
              <Button
                onClick={startGame}
                disabled={isSpinning}
                className={`w-full py-5 text-lg font-bold rounded-2xl transition-all duration-300 ${isSpinning
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-[#81515a] hover:bg-[#663a43] text-white clay-button-primary"
                  }`}
              >
                {isSpinning ? "Spinning..." : "Let's Go!"}
              </Button>
              <Button
                onClick={() => changeScreen("home")}
                disabled={isSpinning}
                className="w-full py-4 font-bold bg-[#e2d8d8] text-[#514345] hover:bg-[#eae0e0] rounded-2xl clay-card"
              >
                Back to Menu
              </Button>
            </div>
          </div>
        )}

        {/* HELP / TUTORIAL */}
        {activeScreen === "tutorial" && (
          <div className="w-full bg-white p-6 rounded-3xl clay-card flex flex-col items-center">
            <h2 className="text-2xl font-bold text-[#81515a] mb-4">How To Play 🎮</h2>
            <div className="w-full flex flex-col gap-4 text-left text-sm text-[#514345]">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-2xl">
                <span className="text-3xl">⭐</span>
                <div>
                  <h3 className="font-bold text-green-800">Tap Correct Targets</h3>
                  <p className="text-xs">Tap stars, balloons, or bunnies quickly to gain points and streaks!</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-2xl">
                <span className="text-3xl">💣</span>
                <div>
                  <h3 className="font-bold text-red-800">Avoid Forbidden Targets</h3>
                  <p className="text-xs">Do NOT tap the 3 forbidden emojis selected by the Lucky Box Spin!</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#fcf1f1] rounded-2xl">
                <span className="text-3xl">⏱️</span>
                <div>
                  <h3 className="font-bold text-[#81515a]">Fast & Furious</h3>
                  <p className="text-xs">You have exactly 15 seconds to tap as many targets as you can!</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => changeScreen("home")}
              className="mt-6 w-full py-4 font-bold bg-[#81515a] text-white rounded-2xl clay-button-primary"
            >
              Back to Menu
            </Button>
          </div>
        )}

        {/* ACTIVE GAME SCREEN */}
        {activeScreen === "game" && (
          <div className="w-full flex flex-col items-center">
            {/* Header bar (Score & timer) */}
            <div className="w-full flex justify-between items-center mb-4 px-2">
              <div className="text-left">
                <p className="text-xs font-semibold text-[#514345]">SCORE</p>
                <p className="text-2xl font-bold text-[#81515a]">{score}</p>
              </div>
              <div className="text-center bg-white px-3 py-1 rounded-xl clay-card">
                <p className="text-[10px] font-bold text-[#3a6470]">STREAK</p>
                <p className="text-lg font-bold text-[#3a6470]">{streak} 🔥</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-[#514345]">TIME LEFT</p>
                <p className="text-2xl font-bold text-[#81515a]">{timeLeft}s</p>
              </div>
            </div>

            {/* Forbidden Emojis (Avoid targets) */}
            <div className="w-full bg-[#fcf1f1] px-4 py-2 rounded-2xl border border-pink-100 flex items-center justify-between mb-4 shadow-sm">
              <span className="text-xs font-bold text-[#81515a] tracking-wider">DO NOT TAP:</span>
              <div className="flex gap-3">
                {forbiddenEmojis.map((emoji, idx) => (
                  <span key={idx} className="text-2xl animate-pulse" style={{ animationDelay: `${idx * 0.3}s` }}>
                    {emoji}
                  </span>
                ))}
              </div>
            </div>

            {/* Time progress bar */}
            <div className="w-full bg-[#e2d8d8] h-4 rounded-full overflow-hidden border-2 border-white mb-6">
              <div
                className="bg-[#81515a] h-full transition-all duration-100"
                style={{ width: `${(timeLeft / 15.0) * 100}%` }}
              ></div>
            </div>

            {/* Spawning Canvas Container */}
            <div className="w-full h-[350px] bg-white rounded-3xl clay-card relative overflow-hidden border-4 border-white shadow-inner select-none">
              {/* Tap feedback indicator */}
              {showTapIndicator && (
                <div
                  className="text-nowrap absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-bounce-slow z-50 bg-[#ffc0cb] border-2 border-white text-xs font-bold text-[#81515a] px-3 py-1.5 rounded-full shadow-lg"
                  style={{ left: `${showTapIndicator.x}%`, top: `${showTapIndicator.y}%` }}
                >
                  {showTapIndicator.text}
                </div>
              )}

              {/* Spawned targets */}
              {targets.map((target) => (
                <button
                  key={target.id}
                  onClick={(e) => {
                    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                    if (rect) {
                      const tapX = ((e.clientX - rect.left) / rect.width) * 100;
                      const tapY = ((e.clientY - rect.top) / rect.height) * 100;
                      handleTargetTap(target, tapX, tapY);
                    }
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 active:scale-95 transition-transform duration-75 flex items-center justify-center"
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    width: `${target.size}px`,
                    height: `${target.size}px`,
                    fontSize: `${target.size * 0.6}px`,
                  }}
                >
                  <span className="inline-block">{target.emoji}</span>
                </button>
              ))}

              {/* Spawning Flying Icons */}
              {flyingIcons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={(e) => {
                    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                    if (rect) {
                      const tapX = ((e.clientX - rect.left) / rect.width) * 100;
                      const tapY = ((e.clientY - rect.top) / rect.height) * 100;
                      handleFlyingIconTap(icon, tapX, tapY);
                    }
                  }}
                  className="animate-fly-across active:scale-90 transition-transform flex items-center justify-center select-none cursor-pointer"
                  style={{
                    "--start-x": icon.startX,
                    "--start-y": icon.startY,
                    "--end-x": icon.endX,
                    "--end-y": icon.endY,
                    "--fly-duration": `${icon.duration}ms`,
                    width: `${icon.size}px`,
                    height: `${icon.size}px`,
                    fontSize: `${icon.size * 0.6}px`,
                  } as React.CSSProperties}
                >
                  <span className="drop-shadow-md">{icon.emoji}</span>
                </button>
              ))}

              {!hasSpawnedAny && targets.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-semibold select-none pointer-events-none">
                  Get ready... 🌟
                </div>
              )}
            </div>

            <Button
              onClick={exitGame}
              className="mt-6 w-full py-4 font-bold bg-[#e2d8d8] text-[#514345] hover:bg-[#eae0e0] rounded-2xl clay-card"
            >
              Exit Game 🚪
            </Button>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {activeScreen === "result" && (
          <div className="w-full bg-white p-6 rounded-3xl clay-card flex flex-col items-center">
            <h2 className="text-3xl font-bold text-[#81515a] mb-2">Game Over! 🏁</h2>
            <div className="w-24 h-24 bg-[#ffd9df] rounded-full border-4 border-white flex items-center justify-center text-5xl mb-4">
              🏆
            </div>

            <p className="text-[#514345] font-semibold text-lg mb-4">You scored:</p>
            <p className="text-6xl font-bold text-[#81515a] mb-6">{score}</p>

            {/* Stars summary */}
            <div className="w-full bg-[#fcf1f1] p-4 rounded-2xl mb-6 flex justify-between items-center text-sm font-semibold">
              <span className="text-[#81515a]">Stars Earned:</span>
              <span className="text-[#81515a] text-lg font-bold">
                +{score >= 5 ? (score >= 8 ? 30 : 15) : 0} ⭐
              </span>
            </div>

            {/* Call to action */}
            <div className="w-full flex flex-col gap-3">
              {score >= 8 && (
                <Button
                  onClick={() => {
                    // Generate random reward between 0.001 and 0.01
                    const rand = (Math.random() * (0.01 - 0.001) + 0.001);
                    setRewardAmount(rand.toFixed(3));
                    changeScreen("reward");
                  }}
                  className="w-full py-5 font-bold bg-[#675f2d] hover:bg-[#4f4717] text-white rounded-2xl clay-button-primary animate-bounce-slow"
                >
                  🎁 Claim USDm Reward!
                </Button>
              )}
              <Button
                onClick={startSpinPhase}
                className="w-full py-5 font-bold bg-[#81515a] hover:bg-[#663a43] text-white rounded-2xl clay-button-primary"
              >
                Play Again
              </Button>
              <Button
                onClick={() => changeScreen("home")}
                className="w-full py-4 font-bold bg-[#e2d8d8] text-[#514345] hover:bg-[#eae0e0] rounded-2xl clay-card"
              >
                Main Menu
              </Button>
            </div>
          </div>
        )}

        {/* REWARD / CLAIM SCREEN */}
        {activeScreen === "reward" && (
          <div className="w-full bg-white p-6 rounded-3xl clay-card flex flex-col items-center">
            <h2 className="text-2xl font-bold text-[#81515a] mb-4">Milestone Claim 🎁</h2>

            {claimStatus === "idle" && (
              <div className="text-center">
                <p className="text-[#514345] text-sm mb-4">
                  Congratulations! You achieved a score of <strong>{score}</strong>. You are eligible to claim a small reward to your connected Celo Wallet.
                </p>
                <div className="bg-[#fcf1f1] p-5 rounded-2xl border-2 border-white mb-4">
                  <p className="text-xs text-[#81515a] font-bold">REWARD AMOUNT</p>
                  <p className="text-3xl font-bold text-[#81515a] mt-1">{rewardAmount} USDm</p>
                </div>
                <p className="text-[11px] text-slate-500 mb-4 italic leading-relaxed">
                  Note: You can swap your USDm to USDT/USDC using MiniPay Pockets.
                </p>
                <Button
                  onClick={handleClaimUSDm}
                  className="w-full py-5 font-bold bg-[#81515a] hover:bg-[#663a43] text-white rounded-2xl clay-button-primary"
                >
                  Claim Reward Now! 🎁
                </Button>
              </div>
            )}

            {claimStatus === "claiming" && (
              <div className="text-center py-6 flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-[#81515a] border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="text-lg font-bold text-[#81515a] mb-2">Processing on Celo...</h3>
                <p className="text-xs text-[#514345]">Please wait while we process your reward transaction.</p>
              </div>
            )}

            {claimStatus === "claimed" && (
              <div className="text-center w-full">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-green-700 mb-2">Claim Successful!</h3>
                <p className="text-xs text-[#514345] mb-6">Your reward has been sent successfully.</p>

                {/* Confetti celebration anchor */}
                <div className="relative w-full h-[150px] rounded-2xl border-4 border-white shadow-[0_8px_16px_rgba(0,0,0,0.06),inset_0_4px_0_rgba(0,0,0,0.05)] bg-[#fff8f7] mb-6 flex flex-col items-center justify-center overflow-visible">
                  <div ref={rewardRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible z-50" />
                  <span className="text-6xl animate-bounce-slow select-none">💰</span>
                  <p className="text-xs font-bold text-[#81515a] mt-2">Claim Completed!</p>
                </div>

                <div className="bg-[#fcf1f1] p-3 rounded-2xl text-left mb-6 overflow-hidden">
                  <p className="text-[10px] font-bold text-[#81515a] mb-1 tracking-wider">Transaction Hash</p>
                  <a
                    href={`https://celoscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group"
                  >
                    <span className="text-[11px] text-slate-500 font-mono truncate">
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </span>
                    <span className="shrink-0 text-[#81515a] opacity-60 group-hover:opacity-100 transition-opacity text-sm">
                      🔗
                    </span>
                  </a>
                </div>

                <Button
                  onClick={() => {
                    setClaimStatus("idle");
                    changeScreen("home");
                  }}
                  className="w-full py-4 font-bold bg-[#81515a] text-white rounded-2xl clay-button-primary"
                >
                  Go Home
                </Button>
              </div>
            )}
          </div>
        )}

        {/* SHOP / COSMETICS SCREEN */}
        {activeScreen === "shop" && (
          <div className="w-full bg-white p-6 rounded-3xl clay-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#81515a]">Target Shop 🧸</h2>
              <div className="bg-[#fcf1f1] px-3 py-1 rounded-xl border border-pink-100 text-xs font-bold text-[#81515a]">
                ⭐ {stars}
              </div>
            </div>

            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto mb-6 pr-1">
              {SKIN_THEMES.map((theme) => {
                const isUnlocked = unlockedSkins.includes(theme.id);
                const isSelected = selectedSkin === theme.id;

                return (
                  <div
                    key={theme.id}
                    className={`p-3 rounded-2xl border-2 flex justify-between items-center transition-all ${isSelected
                      ? "border-[#81515a] bg-[#ffd9df]"
                      : isUnlocked
                        ? "border-slate-200 bg-slate-50"
                        : "border-slate-100 bg-white"
                      }`}
                  >
                    <div className="text-left">
                      <p className="font-bold text-sm text-[#81515a]">{theme.name}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Emojis: {theme.emojis.join(" ")}
                      </p>
                    </div>

                    <Button
                      onClick={() => buySkin(theme.id, theme.price)}
                      disabled={!isUnlocked && stars < theme.price}
                      size="sm"
                      className={`px-3 py-1 text-xs font-bold rounded-xl ${isSelected
                        ? "bg-[#81515a] text-white cursor-default"
                        : isUnlocked
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          : "bg-[#3a6470] text-white hover:bg-[#214c58]"
                        }`}
                    >
                      {isSelected ? "Selected" : isUnlocked ? "Select" : `${theme.price} ⭐`}
                    </Button>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => changeScreen("home")}
              className="w-full py-4 font-bold bg-[#81515a] text-white rounded-2xl clay-button-primary"
            >
              Back to Menu
            </Button>
          </div>
        )}

        {/* LEADERBOARD SCREEN */}
        {activeScreen === "leaderboard" && (
          <div className="w-full bg-white p-6 rounded-3xl clay-card">
            <h2 className="text-2xl font-bold text-[#81515a] mb-6">Daily Leaders 🏆</h2>

            <div className="flex flex-col gap-2.5 mb-6">
              {[
                { rank: 1, name: "0x71C5...4382", score: 28 },
                { rank: 2, name: "0xE0F7...A918", score: 25 },
                { rank: 3, name: "0x3A5d...8C12", score: 22 },
                {
                  rank: 4,
                  name: mounted && isConnected && address
                    ? `${address.slice(0, 8)}...${address.slice(-6)}`
                    : "You",
                  score: highScore
                },
              ]
                .sort((a, b) => b.score - a.score)
                .map((user, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center text-sm border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#81515a] w-5">#{idx + 1}</span>
                      <span className="font-semibold text-slate-700 font-mono">{user.name}</span>
                    </div>
                    <span className="font-bold text-[#81515a]">{user.score} pts</span>
                  </div>
                ))}
            </div>

            <Button
              onClick={() => changeScreen("home")}
              className="w-full py-4 font-bold bg-[#81515a] text-white rounded-2xl clay-button-primary"
            >
              Back to Menu
            </Button>
          </div>
        )}

        {/* PROFILE / STATS SCREEN */}
        {activeScreen === "profile" && (
          <div className="w-full bg-white p-6 rounded-3xl clay-card flex flex-col items-center">
            <h2 className="text-2xl font-bold text-[#81515a] mb-6">Player Stats 🐱</h2>

            <div className="w-20 h-20 bg-[#ffc0cb] rounded-full border-4 border-white flex items-center justify-center text-4xl mb-4">
              🐱
            </div>

            <h3 className="font-bold text-lg text-[#81515a] mb-6 font-mono break-all bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-inner">
              {mounted && isConnected && address
                ? `${address.slice(0, 8)}...${address.slice(-6)}`
                : "Guest Player"}
            </h3>

            <div className="w-full grid grid-cols-2 gap-3 mb-6 text-center">
              <div className="bg-[#fcf1f1] p-3 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400">HIGH SCORE</p>
                <p className="text-xl font-bold text-[#81515a]">{highScore}</p>
              </div>
              <div className="bg-[#fcf1f1] p-3 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400">TOTAL ROUNDS</p>
                <p className="text-xl font-bold text-[#81515a]">{totalGames}</p>
              </div>
            </div>

            <Button
              onClick={() => changeScreen("home")}
              className="w-full py-4 font-bold bg-[#81515a] text-white rounded-2xl clay-button-primary"
            >
              Back to Menu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
