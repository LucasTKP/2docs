const { fontFamily } = require('tailwindcss/defaultTheme')
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

      colors:{
        primary:"#EBEBEB",
        secondary: "#AAAAAA",
        terciary: "#9E9E9E",
        strong: "#8F8F8F",
        hilight: "#D9D9D9",
        red: "#BD0303",
        green: "#087E14"
      }

    },

  },
  plugins: [],
};
