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
        cozy: {
          50:  '#fdf8f3', 100: '#faf0e6', 200: '#f2e0cc', 300: '#e8cdb0',
          400: '#d4a87a', 500: '#b07d56', 600: '#8b5e3c', 700: '#6b4528',
          800: '#4a2f1a', 900: '#2d1a0e',
        },
        warm: {
          50: '#fffdf9', 100: '#fdf6ee', 200: '#f8ead8', 300: '#f0d5b4',
          400: '#e0b882', 500: '#c9935a', 600: '#a97040', 700: '#7a4f2a',
        },
        cream: '#fffdf9',
        bark:  '#5c3d2e',
        mocha: '#3d2b1f',
      },
      boxShadow: {
        cozy:    '0 4px 24px rgba(120,80,40,0.08)',
        'cozy-lg': '0 8px 40px rgba(120,80,40,0.12)',
        'cozy-xl': '0 16px 60px rgba(120,80,40,0.16)',
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