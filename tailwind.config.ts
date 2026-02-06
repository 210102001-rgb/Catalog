import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#137fec',
          600: '#0f6bc7',
          700: '#0c5aa3',
          800: '#0a4a7f',
          900: '#083a5b',
          DEFAULT: '#137fec'
        },
        background: {
          light: '#ffffff',
          dark: '#0a0f16'
        },
        surface: {
          dark: '#111827',
          elevated: '#1f2937',
          hover: '#374151'
        },
        card: {
          dark: '#1f2937'
        },
        border: {
          dark: '#374151',
          light: '#d1d5db'
        },
        text: {
          primary: '#ffffff',
          secondary: '#9ca3af',
          tertiary: '#6b7280',
          inverse: '#111827'
        }
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      maxWidth: {
        45: "180px",
      },
    },
  },
  plugins: [],
}

export default config
