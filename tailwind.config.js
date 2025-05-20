module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        'sidebar': '16rem', // 64 * 4 = 256px (w-64)
      }
    },
  },
  plugins: [],
}