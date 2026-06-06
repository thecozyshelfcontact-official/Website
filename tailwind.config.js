/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          background: '#FAF7F2',
          surface: '#F6F1EA',
          card: '#FFFFFF',
          text: '#3B2A20',
          muted: '#6B5B4F',
          accent: '#6B4F3B',
          hover: '#5A4130',
          sage: '#7A8F7B',
          terracotta: '#B86F52',
          border: '#E8DED3',
        },
        cozy: {
          50:  '#FAF7F2', 100: '#F6F1EA', 200: '#E8DED3', 300: '#D8C7B8',
          400: '#B99F8A', 500: '#8D705D', 600: '#6B5B4F', 700: '#6B4F3B',
          800: '#5A4130', 900: '#3B2A20',
        },
        warm: {
          50: '#FAF7F2', 100: '#F6F1EA', 200: '#F0E4D7', 300: '#E1C9B3',
          400: '#C79C7E', 500: '#B86F52', 600: '#9A5D45', 700: '#6B4F3B',
        },
        sage: {
          50: '#F1F4EF', 100: '#E4EADF', 200: '#CBD7C5', 300: '#AABDA3',
          400: '#8FA184', 500: '#7A8F7B', 600: '#60735F', 700: '#4C5A4A',
        },
        cream: '#FAF7F2',
        linen: '#F6F1EA',
        bark:  '#6B4F3B',
        mocha: '#3B2A20',
      },
      boxShadow: {
        cozy:    '0 10px 30px rgba(75, 50, 32, 0.07)',
        'cozy-lg': '0 18px 55px rgba(75, 50, 32, 0.12)',
        'cozy-xl': '0 28px 80px rgba(75, 50, 32, 0.16)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.7)',
      },
      animation: {
        'fade-in': 'fadeIn .4s ease-in-out',
        'slide-up': 'slideUp .5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp: { from:{ transform:'translateY(20px)', opacity:0 }, to:{ transform:'translateY(0)', opacity:1 } },
        float:   { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
}
