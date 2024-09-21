// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Paths to your JavaScript/TypeScript files
    './public/index.html', // Path to your HTML file(s)
  ],
  theme: {
    extend: {
      screens: {
        xs: { min: '350px', max: '500px' },  // xs for 350 to 500px
        sm: { min: '501px', max: '650px' },  // sm for 501 to 650px
      },
    },
  },
  plugins: [],
};
