/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { 
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"SF Mono"', 'ui-monospace', 'Menlo', 'monospace']
      },
      colors: {
        helix: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          dark: '#0d4738',    // Helix Primary Deep Forest Green
          darker: '#09362b',
          mint: '#e6f7f2',
          surface: '#fbfdfc',
          card: '#ffffff',
          text: '#111e19',
          muted: '#52665e',
        }
      },
      boxShadow: {
        'helix': '0 10px 30px -5px rgba(13, 71, 56, 0.06)',
        'helix-lg': '0 20px 40px -10px rgba(13, 71, 56, 0.1)',
        'helix-pill': '0 4px 14px 0 rgba(13, 71, 56, 0.25)',
      }
    }
  },
  plugins: []
}
