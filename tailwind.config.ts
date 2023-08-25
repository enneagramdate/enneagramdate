import type { Config } from 'tailwindcss';

export default {
  content: ['./client/**/*.{html,js,jsx,tsx,ts}'],
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
