import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wy: {
          bg: '#F5F5F0',
          panel: '#FFFFFF',
          header: '#1A1A1A',
          text: '#000000',
          'text-light': '#FFFFFF',
          accent: '#D4A843',
          'accent-hover': '#C8A200',
          warning: '#CC0000',
          muted: '#7A7A75',
          border: '#D4D4D0',
          success: '#2D8A4E',
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      borderRadius: {
        wy: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
