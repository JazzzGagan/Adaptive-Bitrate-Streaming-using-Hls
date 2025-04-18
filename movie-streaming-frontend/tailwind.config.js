/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background1: "#FFFFFF",
        background2: "#00acc1",
        text: "#FFFFFF",
        hoverWhite: "#f1f1f1",
        hoverBlue: "#008c92",
      },
      fontFamily: {
        custom: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
