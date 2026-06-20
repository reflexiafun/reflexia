import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Helper component for floating emojis in the background
const FloatingEmoji: React.FC<{
  emoji: string;
  delay: number;
  initialX: number;
  initialY: number;
  scale?: number;
}> = ({ emoji, delay, initialX, initialY, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.5 },
  });

  const bounce = Math.sin((frame - delay) / 10) * 25;
  const rotate = Math.cos((frame - delay) / 20) * 15;

  const currentScale = interpolate(progress, [0, 1], [0, scale]);

  return (
    <div
      className="absolute text-[150px] pointer-events-none select-none filter drop-shadow-lg z-10"
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        transform: `translate(-50%, -50%) scale(${currentScale}) translateY(${bounce}px) rotate(${rotate}deg)`,
        opacity: progress,
      }}
    >
      {emoji}
    </div>
  );
};

// Component for a bullet point item that slides/fades in
const BulletPoint: React.FC<{
  text: string;
  delay: number;
  index: number;
}> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.7 },
  });

  const translateX = interpolate(anim, [0, 1], [-80, 0]);
  const opacity = interpolate(anim, [0, 1], [0, 1]);

  return (
    <div
      className="flex items-center gap-6 bg-white/90 backdrop-blur-lg px-10 py-7 rounded-[40px] border border-white shadow-lg w-[900px]"
      style={{
        transform: `translateX(${translateX}px)`,
        opacity,
      }}
    >
      <span className="text-[44px] font-black text-purple-900 leading-tight">{text}</span>
    </div>
  );
};

// Reusable Scene Wrapper for transitions and backgrounds
const Scene: React.FC<{
  bgGradient: string;
  duration: number;
  children: React.ReactNode;
}> = ({ bgGradient, duration, children }) => {
  const frame = useCurrentFrame();

  // Smooth entry/exit opacity and scale mapping
  const opacity = interpolate(
    frame,
    [0, 15, duration - 15, duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const scale = interpolate(
    frame,
    [0, 15, duration - 15, duration],
    [0.92, 1, 1, 0.92],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill className={`bg-gradient-to-tr ${bgGradient} flex flex-col items-center justify-center p-16 font-sans overflow-hidden`}>
      {/* Decorative Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[45%] bg-purple-300/40 rounded-full filter blur-[120px] z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[45%] bg-pink-300/40 rounded-full filter blur-[120px] z-0" />

      {/* Animated Content Container */}
      <div
        className="w-full h-full flex flex-col items-center justify-center relative z-20"
        style={{
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Main Slides composition
export const ReflexiaPromo: React.FC = () => {
  return (
    <AbsoluteFill className="bg-slate-900 font-sans">
      {/* Persistent Background Music (only during the active promotion slides) */}
      <Sequence durationInFrames={1000}>
        <Audio src={staticFile("backsound.mp3")} volume={0.12} loop />
      </Sequence>

      {/* Slide 1: Intro (0s - 5s / 150 frames) */}
      <Sequence durationInFrames={150}>
        <Audio src={staticFile("speech-1.mp3")} volume={1} />
        <Scene bgGradient="from-pink-200 via-purple-100 to-blue-200" duration={150}>
          <FloatingEmoji emoji="⭐" delay={10} initialX={18} initialY={22} scale={1.3} />
          <FloatingEmoji emoji="🎈" delay={20} initialX={82} initialY={27} scale={1.2} />
          <FloatingEmoji emoji="☁️" delay={30} initialX={15} initialY={78} scale={1.4} />
          <FloatingEmoji emoji="👾" delay={40} initialX={85} initialY={72} scale={1.3} />

          <div className="flex flex-col items-center justify-center text-center space-y-12">
            <h1 className="text-[120px] font-black tracking-tighter bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-600 bg-clip-text text-transparent filter drop-shadow-md select-none leading-none">
              REFLEXIA
            </h1>
            <p className="text-[44px] font-black text-purple-955 bg-white/70 px-12 py-5 rounded-[40px] inline-block backdrop-blur-md border border-white/50 shadow-md">
              Play. Win. Repeat.
            </p>
          </div>
        </Scene>
      </Sequence>

      {/* Slide 2: Gameplay (5s - 12.33s / 220 frames) */}
      <Sequence from={150} durationInFrames={220}>
        <Audio src={staticFile("speech-2.mp3")} volume={1} />
        <Scene bgGradient="from-blue-200 via-indigo-100 to-purple-200" duration={220}>
          <FloatingEmoji emoji="🎯" delay={10} initialX={82} initialY={15} scale={1.4} />
          <FloatingEmoji emoji="⚡" delay={25} initialX={18} initialY={82} scale={1.3} />

          <div className="space-y-16 flex flex-col items-center w-full">
            <div className="space-y-4 text-center mb-6">
              <span className="text-[32px] font-black tracking-widest text-pink-600 uppercase">Gameplay</span>
              <h2 className="text-[90px] font-black text-slate-800 leading-none">Fast Reflexes</h2>
            </div>

            <div className="space-y-8">
              <BulletPoint text="⚡ 15-Second Action Rounds" delay={15} index={0} />
              <BulletPoint text="🎯 Tap Emojis to Build Streaks" delay={30} index={1} />
              <BulletPoint text="⚠️ Avoid Forbidden Traps" delay={45} index={2} />
            </div>
          </div>
        </Scene>
      </Sequence>

      {/* Slide 3: Daily Rewards (12.33s - 20.33s / 240 frames) */}
      <Sequence from={370} durationInFrames={240}>
        <Audio src={staticFile("speech-3.mp3")} volume={1} />
        <Scene bgGradient="from-purple-200 via-pink-100 to-orange-200" duration={240}>
          <FloatingEmoji emoji="🎁" delay={10} initialX={18} initialY={15} scale={1.4} />
          <FloatingEmoji emoji="💎" delay={25} initialX={82} initialY={85} scale={1.3} />

          <div className="space-y-16 flex flex-col items-center w-full">
            <div className="space-y-4 text-center mb-6">
              <span className="text-[32px] font-black tracking-widest text-indigo-600 uppercase">Retention</span>
              <h2 className="text-[90px] font-black text-slate-800 leading-none">Daily Rewards</h2>
            </div>

            <div className="space-y-8">
              <BulletPoint text="📅 7-Day Claim Cycle" delay={15} index={0} />
              <BulletPoint text="💸 Daily USDm Stablecoins" delay={30} index={1} />
              <BulletPoint text="⭐ Earn Stars for Custom Themes" delay={45} index={2} />
            </div>
          </div>
        </Scene>
      </Sequence>

      {/* Slide 4: Web3 / MiniPay (20.33s - 27.33s / 210 frames) */}
      <Sequence from={610} durationInFrames={210}>
        <Audio src={staticFile("speech-4.mp3")} volume={1} />
        <Scene bgGradient="from-green-200 via-teal-100 to-blue-200" duration={210}>
          <FloatingEmoji emoji="👛" delay={10} initialX={82} initialY={20} scale={1.4} />
          <FloatingEmoji emoji="🔗" delay={25} initialX={18} initialY={80} scale={1.3} />

          <div className="space-y-16 flex flex-col items-center w-full">
            <div className="space-y-4 text-center mb-6">
              <span className="text-[32px] font-black tracking-widest text-purple-600 uppercase">Web3 Rails</span>
              <h2 className="text-[90px] font-black text-slate-800 leading-none">Secure & Instant</h2>
            </div>

            <div className="space-y-8">
              <BulletPoint text="📲 Gasless Celo Wallet Claims" delay={15} index={0} />
              <BulletPoint text="👛 Integrated with MiniPay" delay={30} index={1} />
              <BulletPoint text="🔄 Instant Swap to USDT/USDC" delay={45} index={2} />
            </div>
          </div>
        </Scene>
      </Sequence>

      {/* Slide 5: Outro (27.33s - 33.33s / 180 frames) */}
      <Sequence from={820} durationInFrames={180}>
        <Audio src={staticFile("speech-5.mp3")} volume={1} />
        <Scene bgGradient="from-pink-200 via-red-100 to-yellow-200" duration={180}>
          <FloatingEmoji emoji="🎉" delay={10} initialX={15} initialY={20} scale={1.4} />
          <FloatingEmoji emoji="🚀" delay={20} initialX={85} initialY={25} scale={1.3} />
          <FloatingEmoji emoji="🏆" delay={30} initialX={20} initialY={80} scale={1.3} />
          <FloatingEmoji emoji="📲" delay={40} initialX={80} initialY={75} scale={1.4} />

          <div className="flex flex-col items-center justify-center text-center space-y-14">
            <div className="space-y-8">
              <h2 className="text-[95px] font-black bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-600 bg-clip-text text-transparent leading-none filter drop-shadow-md select-none">
                PLAY REFLEXIA!
              </h2>
              <p className="text-[38px] font-black text-slate-700 max-w-2xl mx-auto leading-normal">
                Ready to test your reflexes and claim real crypto rewards?
              </p>
            </div>

            <div className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-[36px] px-14 py-7 rounded-[40px] shadow-xl border-4 border-white/30 select-none leading-none">
              Available on MiniPay Celo
            </div>
          </div>
        </Scene>
      </Sequence>

      {/* Slide 6: Blank Black Scene (33.33s - 185s / 4550 frames) to extend duration past 3 minutes (Shorts limit) */}
      <Sequence from={1000} durationInFrames={4550}>
        <AbsoluteFill className="bg-black" />
      </Sequence>
    </AbsoluteFill>
  );
};
