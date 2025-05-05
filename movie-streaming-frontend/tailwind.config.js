/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        helvetica: ["Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        background1: "#808080",
        background2: "#00acc1",
        text: "#FFFFFF",
        hoverWhite: "#f1f1f1",
        hoverBlue: "#008c92",
      },
    },
  },
  plugins: [],
};
