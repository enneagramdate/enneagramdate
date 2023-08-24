import type { Config } from 'tailwindcss';

export default {
  content: ['./client/**/*.{html,js,jsx,tsx,ts}'],
  theme: {
    colors: {},
    fontFamily: {},
    extend: {},
  },
  plugins: [require('daisyui')],
} satisfies Config;
