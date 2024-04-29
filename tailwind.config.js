/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '15': '15px',
      },
      colors: {
        'amarillo-fuerte': '#eeb111',
        'amarillo-medio': '#f3d04f',
        'amarillo-claroW': '#fdf7e4',
        'amarillo-claro': '#FFF8D6',
        'negro': '#484948',
        'gris': '#D9D9D9',
        'verde': '#00D95F',
        'rojo': '#FF0000',
        'blanco': '#FFFFFF',
        'celeste': '#edf4fc',
      },
    },
  },
  plugins: [],
}