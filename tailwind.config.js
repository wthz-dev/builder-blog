/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        brand: {
          50: '#f3f7ff',
          100: '#e6efff',
          200: '#c3d8ff',
          300: '#97b6ff',
          400: '#6b93ff',
          500: '#3f6fff',
          600: '#2c55db',
          700: '#2343ad',
          800: '#1c3588',
          900: '#162a6b',
          950: '#0f1b45',
        },
        accent: '#ff6b6b',
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(16, 24, 40, 0.25)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
