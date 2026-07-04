"use client";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { heroTheme } from "./hero.constants";

export function HeroBackground() {
  const { resolvedTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Performance gate: Only render shader on capable devices
    const isLowPower = navigator.hardwareConcurrency <= 4 || /Mobi|Android/i.test(navigator.userAgent);
    if (!isLowPower) {
      setShouldRender(true);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !shouldRender) return;
    
    const isDark = resolvedTheme === "dark";
    const colors = isDark ? heroTheme.dark : heroTheme.light;

    const renderer = new Renderer({ canvas: canvasRef.current, alpha: true, dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;

    const program = new Program(gl, {
      vertex: /* glsl */ `
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,
      fragment: /* glsl */ `
        precision highp float;
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying vec2 vUv;
        
        void main() {
          // Flowing noise/simplex pattern
          float n = sin(vUv.x * 3.0 + uTime * 0.15) * cos(vUv.y * 3.0 - uTime * 0.1);
          vec3 color = mix(uColorA, uColorB, smoothstep(-0.5, 0.5, n));
          
          // Apply blend modes and grain overlay based on theme
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: colors.meshColorA },
        uColorB: { value: colors.meshColorB },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    
    // Resize handler
    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', resize);
    resize();

    let raf: number;
    const loop = (t: number) => {
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [resolvedTheme, shouldRender]);

  if (!shouldRender) {
    // Mobile / Low Power Fallback
    return (
      <div 
        className="absolute inset-0 -z-10 h-full w-full opacity-60" 
        style={{
          background: resolvedTheme === 'dark' 
            ? 'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.15) 0%, transparent 100%)' 
            : 'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 100%)'
        }}
        aria-hidden="true" 
      />
    );
  }

  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden opacity-80 mix-blend-screen dark:mix-blend-lighten pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay" />
    </div>
  );
}
