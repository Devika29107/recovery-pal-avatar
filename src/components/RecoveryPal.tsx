import { useState, useEffect } from "react";
import recoveryPalAvatar from "@/assets/recovery-pal-avatar.png";

interface RecoveryPalProps {
  adherenceLevel: number; // 0-100
  streak: number;
  className?: string;
}

export const RecoveryPal = ({ adherenceLevel, streak, className = "" }: RecoveryPalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [adherenceLevel]);

  const getHealthMessage = () => {
    if (adherenceLevel >= 90) return "I'm feeling fantastic! 🌟";
    if (adherenceLevel >= 70) return "Getting better every day! 💪";
    if (adherenceLevel >= 50) return "On my way to recovery! 🌱";
    if (adherenceLevel >= 30) return "Making progress! 🌤️";
    return "Let's start this healing journey together! 💙";
  };

  const getAvatarFilter = () => {
    if (adherenceLevel >= 90) return "brightness(1.2) saturate(1.3) contrast(1.1)";
    if (adherenceLevel >= 70) return "brightness(1.1) saturate(1.2)";
    if (adherenceLevel >= 50) return "brightness(1.05) saturate(1.1)";
    if (adherenceLevel >= 30) return "brightness(0.95) saturate(0.9)";
    return "brightness(0.8) saturate(0.7) contrast(0.9)";
  };

  return (
    <div className={`text-center space-y-4 ${className}`}>
      <div className="relative">
        <div
          className={`relative mx-auto w-32 h-32 rounded-full bg-recovery-gradient p-4 shadow-healing transition-all duration-500 ${
            isAnimating ? "animate-bounce" : ""
          }`}
        >
          <img
            src={recoveryPalAvatar}
            alt="Your Recovery Pal"
            className="w-full h-full object-contain transition-all duration-700"
            style={{ filter: getAvatarFilter() }}
          />
        </div>
        
        {/* Health glow effect */}
        <div 
          className="absolute inset-0 rounded-full bg-healing-gradient opacity-20 blur-xl transition-opacity duration-500"
          style={{ opacity: Math.max(0.1, adherenceLevel / 500) }}
        />
      </div>

      <div className="space-y-2">
        <p className="text-lg font-medium text-foreground">{getHealthMessage()}</p>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{adherenceLevel}%</div>
            <div className="text-sm text-muted-foreground">Health Score</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>  
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-healing-gradient transition-all duration-1000 ease-out"
              style={{ width: `${adherenceLevel}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};