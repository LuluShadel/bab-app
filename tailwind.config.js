/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        bgBlue:'#ebf3ff',
        primaryBlue:'#122778',
        primaryYellow:'#ffc113',
        primaryOrange:'#fca61c',
      },
        sans: ['Roboto', 'sans-serif'],    // police par défaut
        rowdies: ['Rowdies', 'cursive'],   // pour les titres
    },
  },
  plugins: [],
}
