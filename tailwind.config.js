/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          50: '#e6f8fa',
          100: '#b3eaf2',
          200: '#80dcea',
          300: '#4dcfe2',
          400: '#26c5dc',
          500: '#06b6d4', // Main cyan
          600: '#0597b3',
          700: '#047891',
          800: '#02586f',
          900: '#01394e',
        },
        // Secondary colors (purple)
        secondary: {
          50: '#f3f0ff',
          100: '#e9e0ff',
          200: '#d4c1ff',
          300: '#bfa2ff',
          400: '#a983ff',
          500: '#8b5cf6', // Main purple
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Accent colors (for positive amounts/actions)
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Main green
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Tremor color overrides
        tremor: {
          brand: {
            faint: '#eff6ff',
            muted: '#bfdbfe',
            subtle: '#60a5fa',
            DEFAULT: '#3b82f6',
            emphasis: '#1d4ed8',
            inverted: '#ffffff',
          },
          background: {
            muted: '#131A2B',
            subtle: '#1F2937',
            DEFAULT: '#111827',
            emphasis: '#374151',
          },
          border: {
            DEFAULT: '#1F2937',
          },
          ring: {
            DEFAULT: '#1F2937',
          },
          content: {
            subtle: '#4B5563',
            DEFAULT: '#6B7280',
            emphasis: '#E5E7EB',
            strong: '#F9FAFB',
            inverted: '#000000',
          },
        },
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(34, 211, 238, 0.3)',
        'glow-lg': '0 0 25px rgba(34, 211, 238, 0.4)',
        'neon-cyan': '0 0 5px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)',
        'neon-purple': '0 0 5px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};