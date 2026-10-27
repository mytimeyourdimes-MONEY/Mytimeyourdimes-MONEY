import React from 'react';

interface SwirlTitleProps {
  as?: 'h1' | 'h2' | 'h3' | 'div' | 'span';
  size?: 'hero' | 'section' | 'card' | 'compact';
  className?: string;
  showBadge?: boolean;
  align?: 'left' | 'center';
}

export const SwirlTitle: React.FC<SwirlTitleProps> = ({
  as: Component = 'h1',
  size = 'hero',
  className = '',
  showBadge = false,
  align = 'left',
}) => {
  // Size-specific typography classes
  const sizeClasses = {
    hero: 'text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1]',
    section: 'text-3xl sm:text-4xl lg:text-4xl tracking-tight leading-tight',
    card: 'text-2xl sm:text-3xl tracking-tight leading-tight',
    compact: 'text-xl sm:text-2xl tracking-tight leading-tight',
  }[size];

  const alignClasses = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`relative inline-flex flex-col ${alignClasses} ${className}`}>
      {showBadge && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-black/90 border border-amber-400/60 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-md mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200">The Official App:</span>
          <span className="text-amber-400 font-extrabold tracking-wider">MY TIME YOUR DIME</span>
        </div>
      )}

      {/* The Swirled Title Container */}
      <Component className={`relative font-display font-black ${sizeClasses} select-none group`}>
        {/* Ambient Backing Glow to make black swirls stand out against dark or light background */}
        <span
          aria-hidden="true"
          className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-emerald-950/40 via-black/30 to-amber-950/40 rounded-2xl blur-md -z-10 pointer-events-none opacity-80"
        />

        {/* 1. BACKGROUND SWIRL SILHOUETTES (Behind text) */}
        <svg
          className="absolute -inset-x-3 -inset-y-3 w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none z-0 overflow-visible opacity-60"
          viewBox="0 0 600 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Deep onyx shadow swirls behind letters */}
          <path
            d="M 10,75 C 60,110 130,20 210,80 C 290,140 370,10 470,70 C 530,105 575,40 595,65"
            stroke="#000000"
            strokeWidth="16"
            strokeLinecap="round"
            className="filter blur-[3px] opacity-80"
          />
          <path
            d="M 40,25 C 120,5 170,95 270,55 C 360,15 420,110 520,35 C 560,5 585,50 590,30"
            stroke="#09090b"
            strokeWidth="12"
            strokeLinecap="round"
            className="filter blur-[2px] opacity-70"
          />
        </svg>

        {/* 2. THE TEXT LAYER: "My Time" (Emerald) & "Your Dime" (Gold) with Black Swirls through the letter glyphs */}
        <span className="relative z-10 inline-flex flex-wrap items-baseline gap-x-3 sm:gap-x-4">
          {/* "My Time" with emerald and embedded black swirl streaks */}
          <span className="relative inline-block">
            {/* The base green letters with rich black swirl bands embedded */}
            <span
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #10b981 0%, #052e16 14%, #000000 22%, #059669 34%, #34d399 44%, #000000 56%, #052e16 64%, #10b981 74%, #000000 84%, #34d399 92%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 0 1px rgba(16, 185, 129, 0.4))',
              }}
              className="font-black tracking-tight"
            >
              My Time
            </span>
          </span>

          {/* "Your Dime" with gold and embedded black swirl streaks */}
          <span className="relative inline-block">
            {/* The base gold letters with rich black swirl bands embedded */}
            <span
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #fbbf24 0%, #451a03 14%, #000000 22%, #f59e0b 34%, #fef08a 44%, #000000 56%, #78350f 64%, #f59e0b 74%, #000000 84%, #fde047 92%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 0 1px rgba(245, 158, 11, 0.4))',
              }}
              className="font-black tracking-tight"
            >
              Your Dime
            </span>
          </span>
        </span>

        {/* 3. FOREGROUND BLACK SWIRLS RUNNING THROUGH THE TITLE (Over & across the letters) */}
        <svg
          className="absolute -inset-x-2 -inset-y-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none z-20 overflow-visible"
          viewBox="0 0 600 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Drop shadow for 3D depth of black swirls weaving over the text */}
            <filter id="swirlShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.95" />
            </filter>
            {/* Fine silver sheen on the edge of the black swirl ribbon */}
            <linearGradient id="onyxRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="25%" stopColor="#18181b" />
              <stop offset="50%" stopColor="#000000" />
              <stop offset="75%" stopColor="#27272a" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            <linearGradient id="silverHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.2" />
              <stop offset="30%" stopColor="#94a3b8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#3f3f46" stopOpacity="0.1" />
              <stop offset="85%" stopColor="#e2e8f0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3f3f46" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* MAIN BLACK SWIRL RIBBON 1: Sweeps diagonally through 'My Time', loops up and cuts through 'Your Dime' */}
          {/* Outer dark casing / shadow */}
          <path
            d="M 5,72 C 35,95 70,105 110,65 C 145,30 170,15 210,48 C 245,78 280,102 330,75 C 380,48 415,18 465,45 C 505,68 540,88 585,42"
            stroke="#000000"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#swirlShadow)"
          />
          {/* Main Onyx Ribbon */}
          <path
            d="M 5,72 C 35,95 70,105 110,65 C 145,30 170,15 210,48 C 245,78 280,102 330,75 C 380,48 415,18 465,45 C 505,68 540,88 585,42"
            stroke="url(#onyxRibbon)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Thin silver luster on center ridge of swirl ribbon */}
          <path
            d="M 5,72 C 35,95 70,105 110,65 C 145,30 170,15 210,48 C 245,78 280,102 330,75 C 380,48 415,18 465,45 C 505,68 540,88 585,42"
            stroke="url(#silverHighlight)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* SECONDARY BLACK SWIRL 2: Spirals and curls through letters */}
          {/* Left swirl loop through 'My' */}
          <path
            d="M 25,30 C 5,45 8,85 35,95 C 65,102 75,70 60,52 C 45,35 22,48 30,68 C 38,82 55,75 50,60"
            stroke="#000000"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#swirlShadow)"
          />
          <path
            d="M 25,30 C 5,45 8,85 35,95 C 65,102 75,70 60,52 C 45,35 22,48 30,68 C 38,82 55,75 50,60"
            stroke="url(#onyxRibbon)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Center swirl looping between 'Time' and 'Your' */}
          <path
            d="M 230,22 C 265,10 295,45 285,80 C 275,108 245,95 250,70 C 255,48 285,38 315,50 C 345,62 375,30 405,25"
            stroke="#000000"
            strokeWidth="4.5"
            strokeLinecap="round"
            filter="url(#swirlShadow)"
          />
          <path
            d="M 230,22 C 265,10 295,45 285,80 C 275,108 245,95 250,70 C 255,48 285,38 315,50 C 345,62 375,30 405,25"
            stroke="url(#onyxRibbon)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Right flourish swirl curling through 'Dime' */}
          <path
            d="M 430,95 C 470,115 520,105 545,75 C 570,45 540,15 510,25 C 485,35 490,75 520,80 C 545,85 570,65 590,82 C 598,90 592,100 580,98"
            stroke="#000000"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#swirlShadow)"
          />
          <path
            d="M 430,95 C 470,115 520,105 545,75 C 570,45 540,15 510,25 C 485,35 490,75 520,80 C 545,85 570,65 590,82 C 598,90 592,100 580,98"
            stroke="url(#onyxRibbon)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Fine calligraphy tendril swirls running horizontally right through the center-line */}
          <path
            d="M 55,60 Q 110,40 160,65 T 270,55 Q 360,40 430,68 T 560,52"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="18 8 35 12"
            filter="url(#swirlShadow)"
          />
          <path
            d="M 55,60 Q 110,40 160,65 T 270,55 Q 360,40 430,68 T 560,52"
            stroke="url(#silverHighlight)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="18 8 35 12"
          />

          {/* Accent Calligraphic Droplet Swirls */}
          <circle cx="28" cy="28" r="3.5" fill="#000000" filter="url(#swirlShadow)" />
          <circle cx="28" cy="28" r="2.2" fill="#18181b" />
          <circle cx="28" cy="27" r="1" fill="#e2e8f0" opacity="0.8" />

          <circle cx="585" cy="40" r="4" fill="#000000" filter="url(#swirlShadow)" />
          <circle cx="585" cy="40" r="2.5" fill="#18181b" />
          <circle cx="585" cy="39" r="1.2" fill="#e2e8f0" opacity="0.8" />

          <circle cx="285" cy="80" r="3" fill="#000000" filter="url(#swirlShadow)" />
          <circle cx="285" cy="80" r="1.8" fill="#18181b" />
        </svg>
      </Component>
    </div>
  );
};
