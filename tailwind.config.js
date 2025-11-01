/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './templates/**/*.liquid',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#000000',
        'deep-blue': '#000000',
        brass: '#d4af37',
        electric: '#00d4ff',
        'dream-purple': '#9b4dca',
        'chicago-grey': '#6c757d',
      },
      fontFamily: {
        heading: ['Open Sans', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
        accent: ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        'display': 'clamp(3rem, 8vw, 6rem)',
        'hero': 'clamp(2rem, 5vw, 4rem)',
        'title': 'clamp(1.5rem, 3vw, 2.5rem)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-surreal': 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 50%, #1a1a2e 100%)',
      },
      boxShadow: {
        'brass-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        'electric-glow': '0 0 30px rgba(0, 212, 255, 0.4)',
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
