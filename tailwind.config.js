/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50:'#fff7ed',100:'#ffedd5',500:'#f97316',600:'#ea580c',700:'#c2410c' }
      },
      animation: {
        'fade-in': 'fadeIn .3s ease-in-out',
        'slide-up': 'slideUp .3s ease-out',
      },
      keyframes: {
        fadeIn: { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp: { from:{ transform:'translateY(10px)', opacity:0 }, to:{ transform:'translateY(0)', opacity:1 } },
      }
    },
  },
  plugins: [],
}