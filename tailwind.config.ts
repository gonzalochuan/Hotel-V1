import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        classy: ['var(--font-classy)', 'serif'],
        perfect: ['var(--font-perfect)', 'sans-serif'],
        perfect_girl_sans: ['var(--font-perfect)', 'sans-serif'],
        romantic: ['var(--font-romantic)', 'serif'],
        colbiac: ['var(--font-colbiac)', 'sans-serif'],
        upstair_sans: ['var(--font-upstair_sans)', 'sans-serif'],
        apple_garamond: ['var(--font-apple_garamond)', 'serif'],
        balmoon: ['var(--font-balmoon)', 'sans-serif'],
      },
      colors: {
        coffee: {
          light: '#704828',
          DEFAULT: '#413524',
          dark: '#b95d3f',
        },
        cream: '#fcecb4',
        lightBlue: '#d3dcec',
        footerBrown: '#A05032',
      },
    },
  },
  plugins: [],
}
export default config
