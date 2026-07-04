"use client";

import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "framer-motion";
import { getProfile } from "@/lib/content";
import { useTypewriter } from "@/hooks/useTypewriter";
import { ChevronDown, Sparkles, ArrowRight, Code2, Layers, Cpu } from "lucide-react";
import Link from "next/link";
import { HeroBackground } from "./HeroBackground";
import { HeroTiltCard } from "./HeroTiltCard";

export default function Hero() {
  const profile = getProfile();
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  
  const typingText = useTypewriter(profile.roles, 75, 40, 2500);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
      
      {/* 1. The OGL WebGL Shader Background (or Mobile Fallback) */}
      <HeroBackground />

      {/* 2. Main Content Grid */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center mt-12 lg:mt-0">
        
        {/* LEFT COLUMN: Copywriting & CTAs */}
        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          animate="visible"
          className="flex flex-col items-start text-left"
        >
          {/* Availability Badge */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-stone-200/50 dark:border-slate-700/50 shadow-sm mb-8 pointer-events-auto cursor-default">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest text-stone-700 dark:text-slate-300 uppercase">
              {profile.availability?.label || "Available for impact"}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-black tracking-tight leading-[1.05] font-[family-name:var(--font-space-grotesk)] text-stone-900 dark:text-white drop-shadow-sm">
            <span className="block">ARCHITECTING</span>
            <span className="block">THE IMPOSSIBLE.</span>
          </motion.h1>
          
          {/* Typewriter Role */}
          <motion.div variants={itemVariants} className="mt-6 min-h-[2em] flex items-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-stone-900 to-stone-600 dark:from-white dark:to-slate-400">
              {prefersReducedMotion ? profile.roles[0] : typingText}
              {!prefersReducedMotion && <span className="text-stone-900 dark:text-white animate-[pulse_1s_ease-in-out_infinite] font-light ml-1">|</span>}
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p variants={itemVariants} className="mt-6 text-base sm:text-lg text-stone-600 dark:text-slate-300 max-w-xl font-light leading-relaxed">
            Pushing the boundaries of what's possible on the web. I am <strong className="font-semibold text-stone-900 dark:text-white">{profile.name}</strong>, a visionary Full Stack Engineer crafting digital masterpieces that redefine user experience and scale infinitely.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto">
            <Link 
              href="#projects" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
              Explore Experiences
            </Link>
            <Link 
              href="#contact" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-stone-900 dark:text-white font-semibold hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all border border-stone-200 dark:border-slate-700 shadow-sm flex items-center justify-center gap-2 group"
            >
              Start a Conversation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: Framer Motion Pseudo-3D Tilt Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-12 lg:mt-0"
        >
          <HeroTiltCard>
            {/* Inner Content of the Card - e.g. a stylized code snippet or profile stats */}
            <div className="flex flex-col h-full z-10" style={{ transform: "translateZ(30px)" }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
                  <img src="/images/logo1.jpg" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-lg">{profile.name}</h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 font-mono">sys.status == "ONLINE"</p>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-100/50 dark:bg-slate-800/50 border border-stone-200/50 dark:border-slate-700/50">
                  <Code2 className="text-emerald-600 dark:text-emerald-400" size={20} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-stone-900 dark:text-white">Frontend Mastery</div>
                    <div className="text-xs text-stone-500 dark:text-slate-400">React, Angular, Next.js</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-100/50 dark:bg-slate-800/50 border border-stone-200/50 dark:border-slate-700/50">
                  <Layers className="text-blue-600 dark:text-blue-400" size={20} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-stone-900 dark:text-white">Backend Architecture</div>
                    <div className="text-xs text-stone-500 dark:text-slate-400">Node.js, .NET Core, SQL</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-100/50 dark:bg-slate-800/50 border border-stone-200/50 dark:border-slate-700/50">
                  <Cpu className="text-purple-600 dark:text-purple-400" size={20} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-stone-900 dark:text-white">DevOps & Cloud</div>
                    <div className="text-xs text-stone-500 dark:text-slate-400">AWS, Docker, CI/CD pipelines</div>
                  </div>
                </div>
              </div>
            </div>
          </HeroTiltCard>
        </motion.div>

      </div>

      {/* Scroll Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400 dark:text-slate-500 z-10 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Discover</span>
        {!prefersReducedMotion && (
          <motion.div 
            animate={{ y: [0, 8, 0] }} 
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} />
          </motion.div>
        )}
      </motion.div>

    </section>
  );
}
