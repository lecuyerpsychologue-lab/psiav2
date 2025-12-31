export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode Colors
        cream: '#FDFBF7',
        slate: '#2D3748',
        coral: '#FF8FAB',
        teal: '#2A9D8F',
        solar: '#E9C46A',
        // Dark Mode Colors
        'dark-bg': '#1A1A2E',
        'dark-card': '#16213E',
        'dark-text': '#E4E4E7',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};