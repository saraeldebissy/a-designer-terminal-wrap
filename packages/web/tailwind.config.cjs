module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1ED760',
        secondary: '#38BDF8',
        accent: '#F59E0B',
        ink: '#06140D',
        panel: '#0D1F15'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.03), 0 20px 60px rgba(6,20,13,0.45)',
      }
    }
  },
  plugins: []
};
