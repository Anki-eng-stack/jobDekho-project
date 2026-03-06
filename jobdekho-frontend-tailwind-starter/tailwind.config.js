module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef3ff",
          100: "#dbe6ff",
          500: "#2f5af7",
          600: "#2548cc",
          700: "#1e3a99",
        },
        border: "#d9e2f3",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(36, 59, 126, 0.08)",
      },
    },
  },
  plugins: [],
};
