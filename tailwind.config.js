/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', 'media'], // allow class toggle and respect system pref
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'align-green': '#95B75D',
        'align-green-dark': '#85A54D',
        'dark-card': '#121212',
        'nav-divider': '#dfe9d6',
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};