/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tradeBg: '#0F172A',       // Dark blue/navy
        tradeDark: '#1E293B',     // Slate dark
        tradeLight: '#64748B',    // Slate
        tradeHighlight: '#6EE7B7', // Emerald light
        tradeError: '#F87171'     // Softer red
      },
      animation: {
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};