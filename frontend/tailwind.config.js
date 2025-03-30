import flowbite from 'flowbite/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", // Add Flowbite React files
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#581c87', 
          light: '#3b0764', // Light shade of primary
          dark: '#a855f7',  // Dark shade of primary
        },
        secondary: {
          DEFAULT: '#2e1065', // Default shade of secondary
          light: '#c4b5fd', // Light shade of secondary
          dark: '#a78bfa',  // Dark shade of secondary
        },
        tertiary: {
          DEFAULT: '#6b21a8', // Default shade of tertiary
          light: '#581c87', // Light shade of tertiary
          dark: '#8b5cf6',  // Dark shade of tertiary
        },
      },
    },
  },
  plugins: [
    flowbite, // Add Flowbite plugin here
  ],
};
