import React, { useState, useEffect, useRef } from 'react';

export default function TechAnimatedBackground() {
  const [isVisible, setIsVisible] = useState(true);
  const mouseRef = useRef({ x: 0, y: 0 });
  const glowRef = useRef<HTMLDivElement>(null);

  // Monitor visibility to pause animations and JS execution when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Track mouse coordinates with Lerp (spring delay) for maximum performance
  useEffect(() => {
    // Set initial target to center of screen
    mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    const updatePosition = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(updatePosition);
        return;
      }

      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      // Linear interpolation (Lerp) for ultra-smooth spring tracking
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX - 300}px, ${currentY - 300}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  // Generate deterministic particles to prevent hydration mismatches
  const particles = Array.from({ length: 18 }, (_, index) => {
    const size = index % 3 === 0 ? 3 : index % 3 === 1 ? 4 : 5; // 3px to 5px
    const left = `${(index * 7) % 100}%`;
    const delay = `${(index * 1.3) % 12}s`;
    const duration = `${12 + (index % 8) * 3.5}s`;
    const colors = [
      'bg-teal-500/60 shadow-[0_0_10px_#0f766e]',
      'bg-blue-500/60 shadow-[0_0_10px_#3b82f6]',
      'bg-violet-500/60 shadow-[0_0_10px_#8b5cf6]',
    ];
    const colorClass = colors[index % colors.length];

    return (
      <div
        key={index}
        className={`absolute rounded-full pointer-events-none ${colorClass}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left,
          bottom: '-20px',
          animation: `floatUp ${duration} linear infinite`,
          animationDelay: delay,
          animationPlayState: isVisible ? 'running' : 'paused',
          willChange: 'transform, opacity',
        }}
      />
    );
  });

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-slate-950">
      {/* 1. Custom CSS animations style tag */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translate3d(40px, -115vh, 0) scale(1.3);
            opacity: 0;
          }
        }

        @keyframes gridPan {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 50px 50px;
          }
        }

        @keyframes blobMorph {
          0%, 100% {
            border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%;
            transform: translate3d(40px, -50px, 0) scale(1.2);
          }
          66% {
            border-radius: 28% 72% 37% 63% / 51% 43% 57% 49%;
            transform: translate3d(-30px, 40px, 0) scale(0.9);
          }
        }

        @keyframes sweepLine {
          0% {
            transform: translateY(-20%) rotate(-12deg);
            opacity: 0;
          }
          10% {
            opacity: 0.15;
          }
          90% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(120%) rotate(-12deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* 2. Slow Animated High-Tech Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 118, 110, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 118, 110, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridPan 40s linear infinite',
          animationPlayState: isVisible ? 'running' : 'paused',
        }}
      />

      {/* 3. Subtle Cyber Dot-Grid Accent Layer */}
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
          backgroundSize: '25px 25px',
        }}
      />

      {/* 4. Giant Slow-Morphing Blurred Neon Blobs (GPU Accelerated) */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        {/* Blob 1: Teal (Primary) */}
        <div
          className="absolute -top-[10%] -left-[10%] w-[550px] h-[550px] bg-teal-800/20 rounded-full blur-[110px]"
          style={{
            animation: 'blobMorph 25s ease-in-out infinite alternate',
            animationPlayState: isVisible ? 'running' : 'paused',
            willChange: 'transform, border-radius',
          }}
        />

        {/* Blob 2: Blue (Secondary) */}
        <div
          className="absolute top-[40%] -right-[5%] w-[600px] h-[600px] bg-blue-800/20 rounded-full blur-[130px]"
          style={{
            animation: 'blobMorph 30s ease-in-out infinite alternate-reverse',
            animationPlayState: isVisible ? 'running' : 'paused',
            willChange: 'transform, border-radius',
          }}
        />

        {/* Blob 3: Purple (Accent) */}
        <div
          className="absolute top-[15%] left-[30%] w-[480px] h-[480px] bg-violet-800/15 rounded-full blur-[120px]"
          style={{
            animation: 'blobMorph 22s ease-in-out infinite alternate',
            animationPlayState: isVisible ? 'running' : 'paused',
            willChange: 'transform, border-radius',
          }}
        />
      </div>

      {/* 5. Laser sweep line (Moving Light Beam) */}
      <div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent pointer-events-none"
        style={{
          animation: 'sweepLine 16s ease-in-out infinite',
          animationPlayState: isVisible ? 'running' : 'paused',
          willChange: 'transform',
        }}
      />

      {/* 6. Dynamic Mouse-Tracking Glow (Lerped position) */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none transition-opacity duration-1000 select-none bg-[radial-gradient(circle,rgba(15,118,110,0.14)_0%,rgba(59,130,246,0.03)_45%,transparent_70%)]"
        style={{
          willChange: 'transform',
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* 7. Soft Ambient Edge vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/80 pointer-events-none" />

      {/* 8. Floating Glowing Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles}
      </div>
    </div>
  );
}
