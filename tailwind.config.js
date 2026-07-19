/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy — all body text, headings
        navy: '#1A2E4A',
        'navy-light': '#2C4363',
        // Pastel swatches (full)
        blush: '#F5AABC',
        peach: '#F5C9A8',
        butter: '#F9D94E',
        lavender: '#C4B5F4',
        sky: '#93C8EE',
        mint: '#A8D5B2',
        // Pastel washes (section backgrounds ~20-30% tint)
        'wash-butter': '#FFFBEA',
        'wash-lavender': '#F2EFFD',
        'wash-sky': '#EAF5FD',
        'wash-mint': '#EBF6EE',
        'wash-peach': '#FEF3EC',
        'wash-blush': '#FEF0F3',
        // Neutral
        cream: '#FAFAF7',
        sand: '#F5F0E8',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '1180px' },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(26,46,74,0.10)',
        card: '0 8px 32px -8px rgba(26,46,74,0.12)',
        float: '0 20px 60px -16px rgba(26,46,74,0.20)',
        tilt: '6px 10px 32px -8px rgba(26,46,74,0.14)',
      },
      rotate: {
        '1.5': '1.5deg',
        '-1.5': '-1.5deg',
        '0.5': '0.5deg',
        '-0.5': '-0.5deg',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        floatY: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        blob: {
          '0%,100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both',
        fadeIn: 'fadeIn 0.5s ease-out both',
        floatY: 'floatY 6s ease-in-out infinite',
        blob: 'blob 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
