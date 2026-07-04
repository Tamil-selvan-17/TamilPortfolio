"use client";
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { heroTheme } from "./hero.constants";

export function HeroTiltCard({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const isDark = resolvedTheme === "dark";
  const shadow = isDark ? heroTheme.dark.cardShadow : heroTheme.light.cardShadow;

  return (
    <div 
      style={{ perspective: 1000 }} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      className="w-full flex justify-center lg:justify-end"
    >
      <motion.div
        style={{ 
          rotateX: prefersReducedMotion ? 0 : rotateX, 
          rotateY: prefersReducedMotion ? 0 : rotateY, 
          transformStyle: "preserve-3d",
          boxShadow: shadow
        }}
        className="relative w-full max-w-sm aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl border border-stone-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-[#0A0E1A]/80 backdrop-blur-xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between group"
      >
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {children}
      </motion.div>
    </div>
  );
}
