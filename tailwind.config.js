/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    screens: {
      xs:  '340px',   // narrow mobile — volume slider show/hide
      sm:  '480px',   // wide mobile
      md:  '768px',   // tablet — unified dock kicks in
      lg:  '1024px',
      xl:  '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        retro:  ['Silkscreen', 'monospace'],
        cute:   ['Fredoka', 'sans-serif'],
        sans:   ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        comfy:  ['Comfortaa', 'cursive'],
        timer:  ['VT323', 'monospace'],
      },

      colors: {
        // ── Cozy Palette ──────────────────────────────────────
        cocoa: {
          DEFAULT: '#4A2E2B',
          dark:    '#382321',
          light:   '#7A4E4A',
        },
        cream: {
          DEFAULT: '#FFFDF5',
          warm:    '#FAF8ED',
          matcha:  '#DCE5B2',
        },
        pastel: {
          pink:    '#F4B5C6',
          green:   '#98B682',
          peach:   '#F8B088',
          amber:   '#E9C46A',
          lavender:'#C3B1E1',
          sky:     '#A8D8EA',
          mint:    '#B5EAD7',
          rose:    '#FFB7B2',
        },
        // ── Station accent overrides ──────────────────────────
        accent: {
          sky:     '#A8D8EA',
          purple:  '#C3B1E1',
          rose:    '#FFB7B2',
          amber:   '#E9C46A',
          pink:    '#F4B5C6',
          emerald: '#B5EAD7',
          indigo:  '#C3B1E1',
          orange:  '#F8B088',
          brass:   '#E9C46A',
          lime:    '#98B682',
        },
      },

      borderWidth: {
        3: '3px',
        5: '5px',
      },

      boxShadow: {
        // Solid offset shadows — the tactile retro look
        'retro-sm': '3px 3px 0px #4A2E2B',
        'retro':    '4px 4px 0px #4A2E2B',
        'retro-md': '5px 5px 0px #4A2E2B',
        'retro-lg': '6px 6px 0px #4A2E2B',
        'retro-xl': '8px 8px 0px #4A2E2B',
        'retro-press': '1px 1px 0px #4A2E2B',

        // Pastel-accent offset shadows
        'retro-pink':  '4px 4px 0px #F4B5C6',
        'retro-green': '4px 4px 0px #98B682',
        'retro-peach': '4px 4px 0px #F8B088',
      },

      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-7px)' },
        },
        'tape-spin': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'vinyl-spin': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%':      { transform: 'translateY(-4px)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%':      { transform: 'rotate(2deg)' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'film-grain': {
          '0%, 100%': { opacity: '0.035' },
          '50%':      { opacity: '0.055' },
        },
      },
      animation: {
        'float':       'float 3.5s ease-in-out infinite',
        'tape-spin':   'tape-spin 3s linear infinite',
        'vinyl-spin':  'vinyl-spin 4s linear infinite',
        'bounce-soft': 'bounce-soft 1.5s infinite',
        'shimmer':     'shimmer 2.5s linear infinite',
        'pulse-soft':  'pulse-soft 2s ease-in-out infinite',
        'wiggle':      'wiggle 0.4s ease-in-out infinite',
        'slide-up':    'slide-up 0.4s ease-out',
        'film-grain':  'film-grain 0.15s steps(1) infinite',
      },
    },
  },
  plugins: [],
};
