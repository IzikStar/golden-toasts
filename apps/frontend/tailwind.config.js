const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

const COLORS = {
  SUNRISE: {
    50: '#fffaf0',
    100: '#ffeacc',
    200: '#ffd199',
    300: '#ffb866',
    400: '#ff9f33',
    500: '#ff8700',
  },
  SUNSET: {
    300: '#f5bcf4',
    400: '#fa8cf8',
    500: '#e155e1',
    600: '#a13aa1',
    700: '#6a2a6a',
  },
  DUSK: {
    500: '#3a1052',
    600: '#2a093d',
  },
  ERROR: '#dc2626',
  GOLD: {
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    900: '#713f12',
  },
  SILVER: {
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
  },
  BRONZE: {
    300: '#fed7aa',
    400: '#fb923c',
    600: '#ea580c',
    900: '#9a3412',
  },
};

const RGBA_COLORS = {
  SUN_GRADIENT_START: 'rgba(252,169,35,1)',
  SUN_GRADIENT_END: 'rgba(184,0,119,1)',
  CARD_BACKGROUND: 'rgba(255, 255, 255, 0.04)',
  CARD_SHADOW: 'rgba(0, 0, 0, 0.2)',
  FLOATING_LIGHT: 'rgba(252, 169, 35, 0.3)',
  FLOATING_MEDIUM: 'rgba(184, 0, 119, 0.35)',
  FLOATING_SUBTLE: 'rgba(184, 0, 119, 0.15)',
  SCROLLBAR_TRACK_LIGHT: 'rgba(0, 0, 0, 0.3)',
  SCROLLBAR_TRACK_DARK: 'rgb(64, 64, 64)',
  SCROLLBAR_THUMB_PRIMARY: 'rgba(220, 38, 38, 0.6)',
  SCROLLBAR_THUMB_SECONDARY: 'rgb(107, 114, 128)',
  SCROLLBAR_THUMB_HOVER_PRIMARY: 'rgba(220, 38, 38, 0.8)',
  SCROLLBAR_THUMB_HOVER_SECONDARY: 'rgb(75, 85, 99)',
  WAVE_PULSE_1: 'rgba(82, 36, 122, 0.35)',
  WAVE_PULSE_2: 'rgba(144, 64, 160, 0.3)',
  WAVE_PULSE_3: 'rgba(194, 24, 91, 0.2)',
  WAVE_PULSE_4: 'rgba(235, 90, 20, 0.2)',
  WAVE_PULSE_5: 'rgba(250, 110, 20, 0.25)',
  WAVE_PULSE_6: 'rgba(92, 44, 135, 0.4)',
  WAVE_PULSE_7: 'rgba(154, 54, 170, 0.35)',
  WAVE_PULSE_8: 'rgba(204, 44, 100, 0.25)',
  WAVE_PULSE_9: 'rgba(235, 100, 30, 0.2)',
  WAVE_PULSE_10: 'rgba(245, 120, 30, 0.25)',
  WAVE_PULSE_11: 'rgba(72, 30, 110, 0.3)',
  WAVE_PULSE_12: 'rgba(134, 40, 150, 0.35)',
  WAVE_PULSE_13: 'rgba(194, 34, 91, 0.3)',
  WAVE_PULSE_14: 'rgba(225, 80, 20, 0.25)',
  WAVE_PULSE_15: 'rgba(235, 100, 20, 0.2)',
  WAVE_PULSE_16: 'rgba(62, 24, 100, 0.3)',
  WAVE_PULSE_17: 'rgba(124, 35, 140, 0.4)',
  WAVE_PULSE_18: 'rgba(184, 24, 81, 0.2)',
  WAVE_PULSE_19: 'rgba(215, 90, 20, 0.35)',
  WAVE_PULSE_20: 'rgba(225, 110, 20, 0.3)',
  WAVE_STOP_1: 'rgb(45, 27, 105)',
  WAVE_STOP_2: 'rgb(76, 29, 149)',
  WAVE_STOP_3: 'rgb(124, 45, 146)',
  WAVE_STOP_4: 'rgb(194, 24, 91)',
  WAVE_STOP_5: 'rgb(229, 62, 62)',
  WAVE_STOP_6: 'rgb(245, 101, 0)',
  WAVE_STOP_7: 'rgb(255, 140, 0)',
  WAVE_STOP_8: 'rgb(255, 179, 71)',
  WAVE_STOP_9: 'rgb(253, 216, 53)',
  SHIMMER_PURPLE: 'rgba(168, 85, 247, 0.08)',
  SHIMMER_WHITE: 'rgba(255, 255, 255, 0.06)',
  SHIMMER_ORANGE: 'rgba(251, 146, 60, 0.08)',
  SHIMMER_PURPLE_INTENSE: 'rgba(168, 85, 247, 0.12)',
  SHIMMER_WHITE_INTENSE: 'rgba(255, 255, 255, 0.1)',
  SHIMMER_ORANGE_INTENSE: 'rgba(251, 146, 60, 0.12)',
  SHIMMER_PURPLE_MID: 'rgba(168, 85, 247, 0.1)',
  SHIMMER_WHITE_MID: 'rgba(255, 255, 255, 0.08)',
  SHIMMER_WHITE_LOW: 'rgba(255, 255, 255, 0.03)',
  SHIMMER_ORANGE_MID: 'rgba(251, 146, 60, 0.1)',
  MEDAL_BACKGROUND_FIRST: 'rgba(234, 179, 8, 1)',
  MEDAL_BACKGROUND_SECOND: 'rgba(156, 163, 175, 0.8)',
  MEDAL_BACKGROUND_THIRD: 'rgba(251, 146, 60, 0.7)',
  MEDAL_BACKGROUND_OTHER: 'rgba(255, 255, 255, 0.3)',
  MEDAL_RING_GOLD: 'rgba(250, 204, 21, 1)',
  MEDAL_RING_SILVER: 'rgba(156, 163, 175, 1)',
  MEDAL_RING_BRONZE: 'rgba(251, 146, 60, 1)',
};

const GRADIENTS = {
  SUN: `radial-gradient(circle, ${RGBA_COLORS.SUN_GRADIENT_START} 0%, ${RGBA_COLORS.SUN_GRADIENT_END} 100%)`,
  WAVE: `linear-gradient(45deg, ${RGBA_COLORS.WAVE_STOP_1} 0%, ${RGBA_COLORS.WAVE_STOP_2} 12%, ${RGBA_COLORS.WAVE_STOP_3} 25%, ${RGBA_COLORS.WAVE_STOP_4} 38%, ${RGBA_COLORS.WAVE_STOP_5} 50%, ${RGBA_COLORS.WAVE_STOP_6} 62%, ${RGBA_COLORS.WAVE_STOP_7} 75%, ${RGBA_COLORS.WAVE_STOP_8} 88%, ${RGBA_COLORS.WAVE_STOP_9} 100%)`,
  GLASS_LIGHT: `linear-gradient(to bottom right, ${RGBA_COLORS.SHIMMER_WHITE_MID}, ${RGBA_COLORS.SHIMMER_WHITE_LOW}`,
  GOLD_MEDAL: `linear-gradient(to bottom right, ${COLORS.GOLD[300]}, ${COLORS.GOLD[600]})`,
  SILVER_MEDAL: `linear-gradient(to bottom right, ${COLORS.SILVER[300]}, ${COLORS.SILVER[500]})`,
  BRONZE_MEDAL: `linear-gradient(to bottom right, ${COLORS.BRONZE[300]}, ${COLORS.BRONZE[600]})`,
  SUNRISE_WAVE: `linear-gradient(to bottom right, ${COLORS.DUSK[600]} 80%, ${COLORS.SUNSET[700]} 60%, ${COLORS.DUSK[500]} 70%);
  .backdrop-blur-sm {
    --tw-backdrop-blur: blur(4px);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}`,
  SUN_HOVER: `radial-gradient(circle, ${RGBA_COLORS.SUN_GRADIENT_START} 0%, ${RGBA_COLORS.SUN_GRADIENT_END} 100%)`,
};

const ANIMATIONS = {
  WAVE_GRADIENT: 'wave-gradient 8s ease-in-out infinite',
  WAVE_PULSE: 'wave-pulse 4s ease-in-out infinite',
  WAVE_SHIMMER: 'wave-shimmer 13s linear infinite',
  FADE_SOFT: 'fade-soft 0.6s ease-out',
  SCALE_BOUNCE: 'scale-bounce 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  HOVER_LIFT: 'hover-lift 0.2s ease-out',
  PULSE_SMOOTH: 'pulse-smooth 2s ease-in-out infinite',
  FLOAT_GENTLE: 'float-gentle 3s ease-in-out infinite',
  GLOW_PULSE: 'glow-pulse 1.5s ease-in-out infinite alternate',
  SLIDE_IN_LEFT: 'slide-in-left 0.4s ease-out',
  SLIDE_IN_RIGHT: 'slide-in-right 0.4s ease-out',
  FADE_IN_UP: 'fade-in-up 0.5s ease-out',
  SHIMMER_SWEEP: 'shimmer-sweep 2s linear infinite',
  WILD: 'wild 2s ease-in-out infinite',
};

const KEYFRAMES = {
  WAVE_GRADIENT: {
    '0%': { 'background-position': '20% 40%', 'background-size': '250% 250%' },
    '25%': { 'background-position': '35% 55%', 'background-size': '260% 260%' },
    '50%': { 'background-position': '65% 45%', 'background-size': '250% 250%' },
    '75%': { 'background-position': '40% 65%', 'background-size': '240% 240%' },
    '100%': {
      'background-position': '20% 40%',
      'background-size': '250% 250%',
    },
  },
  WAVE_PULSE: {
    '0%': {
      transform: 'scale(1) rotate(0deg)',
      background: `radial-gradient(circle at 30% 70%, ${RGBA_COLORS.WAVE_PULSE_1} 0%, ${RGBA_COLORS.WAVE_PULSE_2} 25%, ${RGBA_COLORS.WAVE_PULSE_3} 50%, ${RGBA_COLORS.WAVE_PULSE_4} 75%, ${RGBA_COLORS.WAVE_PULSE_5} 100%)`,
    },
    '25%': {
      transform: 'scale(1.015) rotate(0.3deg)',
      background: `radial-gradient(circle at 65% 35%, ${RGBA_COLORS.WAVE_PULSE_6} 0%, ${RGBA_COLORS.WAVE_PULSE_7} 25%, ${RGBA_COLORS.WAVE_PULSE_8} 50%, ${RGBA_COLORS.WAVE_PULSE_9} 75%, ${RGBA_COLORS.WAVE_PULSE_10} 100%)`,
    },
    '50%': {
      transform: 'scale(0.985) rotate(-0.3deg)',
      background: `radial-gradient(circle at 50% 50%, ${RGBA_COLORS.WAVE_PULSE_11} 0%, ${RGBA_COLORS.WAVE_PULSE_12} 25%, ${RGBA_COLORS.WAVE_PULSE_13} 50%, ${RGBA_COLORS.WAVE_PULSE_14} 75%, ${RGBA_COLORS.WAVE_PULSE_15} 100%)`,
    },
    '75%': {
      transform: 'scale(1.01) rotate(0.2deg)',
      background: `radial-gradient(circle at 20% 80%, ${RGBA_COLORS.WAVE_PULSE_16} 0%, ${RGBA_COLORS.WAVE_PULSE_17} 25%, ${RGBA_COLORS.WAVE_PULSE_18} 50%, ${RGBA_COLORS.WAVE_PULSE_19} 75%, ${RGBA_COLORS.WAVE_PULSE_20} 100%)`,
    },
    '100%': {
      transform: 'scale(1) rotate(0deg)',
      background: `radial-gradient(circle at 30% 70%, ${RGBA_COLORS.WAVE_PULSE_1} 0%, ${RGBA_COLORS.WAVE_PULSE_2} 25%, ${RGBA_COLORS.WAVE_PULSE_3} 50%, ${RGBA_COLORS.WAVE_PULSE_4} 75%, ${RGBA_COLORS.WAVE_PULSE_5} 100%)`,
    },
  },
  WAVE_SHIMMER: {
    '0%': {
      background: `linear-gradient(90deg, transparent 0%, ${RGBA_COLORS.SHIMMER_PURPLE} 25%, ${RGBA_COLORS.SHIMMER_WHITE} 50%, ${RGBA_COLORS.SHIMMER_ORANGE} 75%, transparent 100%)`,
      transform: 'translateX(-100%)',
    },
    '33%': {
      background: `linear-gradient(90deg, transparent 0%, ${RGBA_COLORS.SHIMMER_PURPLE_INTENSE} 25%, ${RGBA_COLORS.SHIMMER_WHITE_INTENSE} 50%, ${RGBA_COLORS.SHIMMER_ORANGE_INTENSE} 75%, transparent 100%)`,
      transform: 'translateX(-20%)',
    },
    '66%': {
      background: `linear-gradient(90deg, transparent 0%, ${RGBA_COLORS.SHIMMER_PURPLE_MID} 25%, ${RGBA_COLORS.SHIMMER_WHITE_MID} 50%, ${RGBA_COLORS.SHIMMER_ORANGE_MID} 75%, transparent 100%)`,
      transform: 'translateX(20%)',
    },
    '100%': {
      background: `linear-gradient(90deg, transparent 0%, ${RGBA_COLORS.SHIMMER_PURPLE} 25%, ${RGBA_COLORS.SHIMMER_WHITE} 50%, ${RGBA_COLORS.SHIMMER_ORANGE} 75%, transparent 100%)`,
      transform: 'translateX(100%)',
    },
  },
  FADE_SOFT: {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  SCALE_BOUNCE: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1.02)' },
  },
  HOVER_LIFT: {
    '0%': { transform: 'translateY(0) scale(1)' },
    '100%': { transform: 'translateY(-2px) scale(1.02)' },
  },
  PULSE_SMOOTH: {
    '0%': { opacity: 0.8, transform: 'scale(1)' },
    '50%': { opacity: 1, transform: 'scale(1.02)' },
    '100%': { opacity: 0.8, transform: 'scale(1)' },
  },
  FLOAT_GENTLE: {
    '0%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-6px)' },
    '100%': { transform: 'translateY(0px)' },
  },
  GLOW_PULSE: {
    '0%': {
      'box-shadow': `0 0 5px ${RGBA_COLORS.FLOATING_LIGHT}, 0 0 10px ${RGBA_COLORS.FLOATING_SUBTLE}`,
    },
    '100%': {
      'box-shadow': `0 0 10px ${RGBA_COLORS.FLOATING_MEDIUM}, 0 0 20px ${RGBA_COLORS.FLOATING_LIGHT}`,
    },
  },
  SLIDE_IN_LEFT: {
    '0%': { transform: 'translateX(-100%)', opacity: 0 },
    '100%': { transform: 'translateX(0)', opacity: 1 },
  },
  SLIDE_IN_RIGHT: {
    '0%': { transform: 'translateX(100%)', opacity: 0 },
    '100%': { transform: 'translateX(0)', opacity: 1 },
  },
  FADE_IN_UP: {
    '0%': { transform: 'translateY(20px)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 },
  },
  SHIMMER_SWEEP: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
  WILD: {
    '0%': {
      transform: 'translate(-50%, -50%) rotate(0deg) scale(1)',
      color: '#fff',
    },
    '25%': {
      transform: 'translate(-50%, -50%) rotate(10deg) scale(1.2)',
      color: '#f00',
    },
    '50%': {
      transform: 'translate(-50%, -50%) rotate(-10deg) scale(1.1)',
      color: '#0f0',
    },
    '75%': {
      transform: 'translate(-50%, -50%) rotate(10deg) scale(1.3)',
      color: '#00f',
    },
    '100%': {
      transform: 'translate(-50%, -50%) rotate(0deg) scale(1)',
      color: '#fff',
    },
  },
};

const SCROLLBAR_UTILITIES = {
  '.scrollbar-styled': {
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      'background-color': RGBA_COLORS.SCROLLBAR_TRACK_LIGHT,
      'border-radius': '50px',
    },
    '&::-webkit-scrollbar-thumb': {
      'background-color': RGBA_COLORS.SCROLLBAR_THUMB_PRIMARY,
      'border-radius': '50px',
      '&:hover': {
        'background-color': RGBA_COLORS.SCROLLBAR_THUMB_HOVER_PRIMARY,
      },
    },
    '&.dark': {
      '&::-webkit-scrollbar-track': {
        'background-color': RGBA_COLORS.SCROLLBAR_TRACK_DARK,
      },
      '&::-webkit-scrollbar-thumb': {
        'background-color': RGBA_COLORS.SCROLLBAR_THUMB_SECONDARY,
        '&:hover': {
          'background-color': RGBA_COLORS.SCROLLBAR_THUMB_HOVER_SECONDARY,
        },
      },
    },
  },
  '.scrollbar-theme': {
    '&::-webkit-scrollbar': {
      width: '0.7vw',
    },
    '&::-webkit-scrollbar-track': {
      'background-color': COLORS.SUNSET[600],
      'border-radius': '9999px',
    },
    '&::-webkit-scrollbar-thumb': {
      'background-color': COLORS.SUNRISE[400],
      'border-radius': '9999px',
      '&:hover': {
        'background-color': COLORS.SUNRISE[300],
      },
    },
    '@media (prefers-color-scheme: dark)': {
      '&::-webkit-scrollbar-track': {
        'background-color': 'rgb(64, 64, 64)',
      },
      '&::-webkit-scrollbar-thumb': {
        'background-color': 'rgb(107, 114, 128)',
        '&:hover': {
          'background-color': 'rgb(75, 85, 99)',
        },
      },
    },
  },
  '.gradient-hover-smooth': {
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: GRADIENTS.SUN,
      opacity: '0',
      'border-radius': 'inherit',
      'z-index': '-1',
      transition: 'opacity 500ms ease-in-out',
    },
    '&:hover::before': {
      opacity: '1',
    },
  },
};

module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        sunrise: COLORS.SUNRISE,
        sunset: COLORS.SUNSET,
        dusk: COLORS.DUSK,
        error: COLORS.ERROR,
        gold: COLORS.GOLD,
        silver: COLORS.SILVER,
        bronze: COLORS.BRONZE,
        'floating-light': RGBA_COLORS.FLOATING_LIGHT,
        'floating-medium': RGBA_COLORS.FLOATING_MEDIUM,
        'floating-subtle': RGBA_COLORS.FLOATING_SUBTLE,
        'medal-first': RGBA_COLORS.MEDAL_BACKGROUND_FIRST,
        'medal-second': RGBA_COLORS.MEDAL_BACKGROUND_SECOND,
        'medal-third': RGBA_COLORS.MEDAL_BACKGROUND_THIRD,
        'medal-other': RGBA_COLORS.MEDAL_BACKGROUND_OTHER,
      },
      backgroundImage: {
        'sun-gradient': GRADIENTS.SUN,
        'gradient-wave': GRADIENTS.WAVE,
        'glass-light': GRADIENTS.GLASS_LIGHT,
        'gold-medal': GRADIENTS.GOLD_MEDAL,
        'silver-medal': GRADIENTS.SILVER_MEDAL,
        'bronze-medal': GRADIENTS.BRONZE_MEDAL,
        'sunrise-wave': GRADIENTS.SUNRISE_WAVE,
        'sun-hover': GRADIENTS.SUN_HOVER,
      },
      animation: {
        'wave-gradient': ANIMATIONS.WAVE_GRADIENT,
        'wave-pulse': ANIMATIONS.WAVE_PULSE,
        'wave-shimmer': ANIMATIONS.WAVE_SHIMMER,
        'fade-soft': ANIMATIONS.FADE_SOFT,
        'scale-bounce': ANIMATIONS.SCALE_BOUNCE,
        'hover-lift': ANIMATIONS.HOVER_LIFT,
        'pulse-smooth': ANIMATIONS.PULSE_SMOOTH,
        'float-gentle': ANIMATIONS.FLOAT_GENTLE,
        'glow-pulse': ANIMATIONS.GLOW_PULSE,
        'slide-in-left': ANIMATIONS.SLIDE_IN_LEFT,
        'slide-in-right': ANIMATIONS.SLIDE_IN_RIGHT,
        'fade-in-up': ANIMATIONS.FADE_IN_UP,
        'shimmer-sweep': ANIMATIONS.SHIMMER_SWEEP,
        wild: ANIMATIONS.WILD,
      },
      keyframes: {
        'wave-gradient': KEYFRAMES.WAVE_GRADIENT,
        'wave-pulse': KEYFRAMES.WAVE_PULSE,
        'wave-shimmer': KEYFRAMES.WAVE_SHIMMER,
        'fade-soft': KEYFRAMES.FADE_SOFT,
        'scale-bounce': KEYFRAMES.SCALE_BOUNCE,
        'hover-lift': KEYFRAMES.HOVER_LIFT,
        'pulse-smooth': KEYFRAMES.PULSE_SMOOTH,
        'float-gentle': KEYFRAMES.FLOAT_GENTLE,
        'glow-pulse': KEYFRAMES.GLOW_PULSE,
        'slide-in-left': KEYFRAMES.SLIDE_IN_LEFT,
        'slide-in-right': KEYFRAMES.SLIDE_IN_RIGHT,
        'fade-in-up': KEYFRAMES.FADE_IN_UP,
        'shimmer-sweep': KEYFRAMES.SHIMMER_SWEEP,
        wild: KEYFRAMES.WILD,
      },
      boxShadow: {
        warm: `0 4px 16px ${RGBA_COLORS.CARD_SHADOW}`,
      },
      backgroundColor: {
        card: RGBA_COLORS.CARD_BACKGROUND,
      },
      ringColor: {
        'gold-medal': RGBA_COLORS.MEDAL_RING_GOLD,
        'silver-medal': RGBA_COLORS.MEDAL_RING_SILVER,
        'bronze-medal': RGBA_COLORS.MEDAL_RING_BRONZE,
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }) {
      addUtilities(SCROLLBAR_UTILITIES);
    },
  ],
};
