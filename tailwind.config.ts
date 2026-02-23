import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        garamond: ['"EB Garamond"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        beige: '#a89578',
        'beige-dark': '#9a8568',
        'beige-light': '#b8a588',
        'beige-deep': '#7a6a54',
        black: '#000000',
        white: '#ffffff',
      },
      borderRadius: {
        none: '0',
      },
      boxShadow: {
        none: 'none',
      },
      maxWidth: {
        '6xl': '72rem',
      },
    },
  },
  plugins: [],
};
export default config;
