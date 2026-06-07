import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E73D8',
        secondary: '#38A3FF',
        navy: '#1B2738',
        background: '#FFFFFF',
        'light-bg': '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
  safelist: [
    'object-center', 'object-top', 'object-[center_15%]', 'object-[center_20%]',
    'bg-primary/8', 'md:grid-cols-4', 'md:grid-cols-5',
    'bg-blue-100',   'text-blue-700',
    'bg-green-100',  'text-green-700',
    'bg-orange-100', 'text-orange-700',
    'bg-pink-100',   'text-pink-700',
    'bg-purple-100', 'text-purple-700',
    'bg-teal-100',   'text-teal-700',
    'bg-yellow-100', 'text-yellow-800',
    'bg-violet-100', 'text-violet-700',
  ],
}
export default config
