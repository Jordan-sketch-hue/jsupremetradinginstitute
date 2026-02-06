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
        royal: {
          green: '#014421',
          emerald: '#046307',
        },
        accent: {
          gold: '#C9A227',
        },
        matte: {
          black: '#0A0A0A',
        },
        platinum: '#F5F5F5',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('/patterns/grid.svg')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
