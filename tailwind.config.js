// tailwind.config.js
module.exports = {
  darkMode: 'class', // Use class-based dark mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          500: '#84cc16',
        }
      }
    },
  },
  plugins: [],
}