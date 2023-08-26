import type { Config } from 'tailwindcss';

export default {
  content: ['./client/**/*.{html,js,jsx,tsx,ts}', './public/index.html'],
  theme: {
    container: {
      center: true,
    },
    colors: {},
    fontFamily: {},
    extend: {},
  },
  plugins: [require('daisyui')],
} satisfies Config;
