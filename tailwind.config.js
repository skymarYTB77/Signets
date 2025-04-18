/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        primary: {
          light: '#6dd5ed',
          DEFAULT: '#2193b0'
        },
        secondary: {
          light: '#667eea',
          DEFAULT: '#764ba2'
        },
        success: {
          light: '#00b09b',
          DEFAULT: '#96c93d'
        },
        error: {
          light: '#ff0844',
          DEFAULT: '#ffb199'
        },
        info: {
          light: '#00f260',
          DEFAULT: '#0575e6'
        },
        warning: {
          light: '#ff416c',
          DEFAULT: '#ff4b2b'
        },
        dark: {
          bg: '#1a1c2e',
          card: 'rgba(26, 28, 46, 0.95)'
        },
        neutral: {
          text: '#a0aec0'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2193b0, #6dd5ed)',
        'gradient-save': 'linear-gradient(135deg, #667eea, #764ba2)',
        'gradient-accept': 'linear-gradient(135deg, #00b09b, #96c93d)',
        'gradient-delete': 'linear-gradient(135deg, #ff0844, #ffb199)',
        'gradient-export': 'linear-gradient(135deg, #00f260, #0575e6)',
        'gradient-reject': 'linear-gradient(135deg, #ff416c, #ff4b2b)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        code: ['Fira Code', 'monospace']
      }
    }
  },
  plugins: [],
};