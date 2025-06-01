/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Helvetica: ["Helvetica Neue", "sans-serif"],
        LaBelleAurore: ["La Belle Aurore", "sans-serif"],
        Coolvetica: ["Coolvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};
