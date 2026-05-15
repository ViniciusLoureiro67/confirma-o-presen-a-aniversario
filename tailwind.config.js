/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        rose: {
          50: '#fff5f7',
          100: '#ffe4ec',
          200: '#ffc9d9',
          300: '#ffa3bd',
          400: '#ff7aa1',
          500: '#f25c8a',
        },
        lilac: {
          50: '#f8f5ff',
          100: '#ece4ff',
          200: '#d9c7ff',
          300: '#c0a3ff',
          400: '#a37bff',
          500: '#8757f0',
        },
        gold: {
          50: '#fffaf0',
          100: '#fff1d6',
          200: '#ffe1a8',
          300: '#f5c97a',
          400: '#e0aa53',
          500: '#c08a36',
        },
      },
      backgroundImage: {
        'party-gradient':
          'linear-gradient(135deg, #fff5f7 0%, #ffe4ec 25%, #ece4ff 65%, #fff1d6 100%)',
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(193, 122, 168, 0.25)',
        glass: '0 8px 32px rgba(155, 110, 200, 0.18)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
