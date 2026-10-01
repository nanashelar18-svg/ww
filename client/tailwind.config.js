/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nexus: {
          dark: '#080c14',
          surface: '#0f1624',
          card: '#162032',
          border: 'rgba(255, 255, 255, 0.08)',
          cyan: '#00f2fe',
          purple: '#9d4edd',
          emerald: '#00ff88',
          amber: '#ffb300',
          rose: '#ff3366'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
