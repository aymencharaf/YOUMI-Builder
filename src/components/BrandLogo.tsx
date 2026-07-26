import React from 'react';
import logoImg from '../assets/images/youmi_app_logo_1784978064845.jpg';

interface BrandLogoProps {
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  textClassName?: string;
}

export default function BrandLogo({
  size = 36,
  showText = false,
  showTagline = false,
  className = '',
  textClassName = '',
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-Fidelity 3D Metallic YOUMI Logo Graphic */}
      <div 
        className="relative shrink-0 rounded-xl overflow-hidden shadow-lg shadow-purple-900/30 transition-transform duration-300 hover:scale-105 border border-purple-500/20"
        style={{ width: size, height: size }}
      >
        <img
          src={logoImg}
          alt="YOUMI Logo"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Brand Name Text Block */}
      {showText && (
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-1 leading-none">
            <span className={`font-black tracking-tight text-slate-900 dark:text-white uppercase ${textClassName || 'text-lg'}`}>
              YOUM
            </span>
            <span className={`font-black tracking-tight text-purple-400 uppercase ${textClassName || 'text-lg'}`}>
              I
            </span>
            <span className={`font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent uppercase ${textClassName || 'text-lg'} ml-1`}>
              Builder
            </span>
          </div>

          {showTagline && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-4 h-[1.5px] bg-cyan-400 rounded-full" />
              <span className="text-[9px] font-bold text-slate-300 dark:text-slate-400 tracking-wider uppercase font-mono">
                BUILD • CREATE • DEPLOY • GROW
              </span>
              <span className="w-4 h-[1.5px] bg-purple-500 rounded-full" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

