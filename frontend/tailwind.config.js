/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: { 50:'#f6f7f4',100:'#e8ebe3',200:'#d2d8c8',300:'#b3bfa3',400:'#95a67e',500:'#7a8d63',600:'#62724e',700:'#4d5a3e',800:'#414b35',900:'#383f2f' },
        blush: { 50:'#fdf5f3',100:'#fce8e4',200:'#fad5cd',300:'#f5b8aa',400:'#ee9179',500:'#e4714f',600:'#d05534',700:'#ae4428',800:'#903b24',900:'#7a3524' },
        champagne: { 50:'#fdfbf5',100:'#faf5e6',200:'#f4e9c8',300:'#edd9a3',400:'#e4c476',500:'#dbb053',600:'#c49538',700:'#a3762f',800:'#85602c',900:'#6e5028' },
        ivory: { 50:'#fefdf8',100:'#fdfae8',200:'#faf3c8',300:'#f5e897',400:'#eed85f',500:'#e5c83a',600:'#cba82a',700:'#a98322',800:'#8b6823',900:'#725521' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
}
