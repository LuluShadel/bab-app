/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        bgBlue:'#ebf3ff',
        primaryBlue:'#122778',
        SecondBlue:'#cde1fe',
        primaryYellow:'#ffc113',
        primaryOrange:'#fca61c',
        primaryGreen: "#0f7d49"
      },
        sans: ['Roboto', 'sans-serif'],    // police par défaut
        rowdies: ['Rowdies', 'cursive'],   // pour les titres
    },
  },
  plugins: [],
}
