import type { Config } from 'tailwindcss';

export default {
  content: ['./client/**/*.{html,js,jsx,tsx,ts}', './public/index.html'],
  theme: {
    container: {
      center: true,
    },
    colors: {
      9: '#EC50B6',
      8: '#CF0010',
      7: '#F8A400',
      6: '#FBD504',
      5: '#78CD34',
      4: '#32A75F',
      3: '#329F9D',
      2: '#21669E',
      1: '#2826A7',
      recCard: '#cba2ff',
      black: '#414A4C',
      white: '#F8F8FF',
    },
    fontFamily: {},
    extend: {},
  },
  plugins: [require('daisyui')],
} satisfies Config;
