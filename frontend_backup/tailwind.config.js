export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EFFBF3",
          100: "#D9F2E3",
          200: "#B0E3C6",
          300: "#7FCE9F",
          400: "#4FB57C",
          500: "#1F7A4D",
          600: "#186B41",
          700: "#134F32",
          800: "#0F3D26",
          900: "#0A2A1A",
        },
        gold: { 400: "#E8B84B", 500: "#D4A017" },
      },
      fontFamily: { sans: ['"Inter"', "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};