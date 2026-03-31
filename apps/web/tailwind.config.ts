import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14213d',
        sand: '#f5efe6',
        ember: '#f77f00',
        moss: '#385d4f',
        sky: '#cbe7f5',
      },
      fontFamily: {
        sans: ['Manrope', 'Segoe UI', 'sans-serif'],
        display: ['Space Grotesk', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 24px 80px rgba(20, 33, 61, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;