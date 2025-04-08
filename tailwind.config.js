/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tradeBg: '#071E22',
        tradeDark: '#1D7874',
        tradeLight: '#679289',
        tradeHighlight: '#F4C095',
        tradeError: '#EE2E31'
      },
      animation: {
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};