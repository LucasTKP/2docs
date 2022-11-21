// tailwind.config.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require('tailwindcss/defaultTheme')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily:{
        poiretOne: ['var(--font-poiretOne)', ...fontFamily.sans],
        poppins: ['var(--font-poppins)', ...fontFamily.sans]
      },

      screens: {
        "lsm": "450px",
        ...defaultTheme.screens,
      },

    },
    colors:{
      primary:"#DDDDDD",
      secondary: "#AAAAAA",
      terciary: "#9E9E9E",
      strong: "#686868"
    }
  },
  plugins: [],
};
