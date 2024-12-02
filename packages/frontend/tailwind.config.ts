import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      backgroundColor: {
        'black/4': 'rgba(0, 0, 0, 0.4)',
        'white/4': 'rgba(255,255,255,0.4)',
      },
    },
    colors: {
      'extra-light-gray': 'var(--extra-light-gray)',
      'light-gray': 'var(--light-gray)',
      gray: 'var(--gray)',
      'dark-gray': 'var(--dark-gray)',
      black: 'var(--black)',
      white: 'var(--white)',
      'light-yellow': 'var(--light-yellow)',
      'light-orange': 'var(--light-orange)',
      orange: 'var(--orange)',
      red: 'var(--red)',
      green: 'var(--green)',
      blue: 'var(--blue)',
    },
  },
  plugins: [],
};

export default config;
