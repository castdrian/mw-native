const colors = require('tailwindcss/colors');

// https://github.com/marklawlor/nativewind/issues/573
module.exports = {
  content: ['./**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ...colors,
        purple: {
          100: '#C082FF',
          300: '#8D44D6',
          400: '#7831BF',
        },
        shade: {
          50: '#676790',
          200: '#3F3F60',
          300: '#32324F',
          700: '#131322',
          900: '#0A0A12',
        },
      },
    },
  },
  plugins: [],
};
