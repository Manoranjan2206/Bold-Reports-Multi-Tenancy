/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "theme-green": "#034737",
        "theme-green-dark": "#023529",
        "theme-blue": "#3370f1",
        "theme-teal": "#66deba",
        "page-bg": "#f0f4f8",
        "fab-orange": "#f7aa4d",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"],
        "mono": ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"]
      },
    },
  },
  plugins: [],
}
