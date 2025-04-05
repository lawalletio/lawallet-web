import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '600px',
      },
    },
    ringColor: {
      DEFAULT: 'hsl(var(--primary))',
    },
    fontSize: {
      base: '.8rem',
      sm: '0.7rem',
      md: '.8rem',
      xl: '1rem',
      '2xl': '1.25rem',
      '3xl': '1.563rem',
      '4xl': '1.953rem',
      '5xl': '2.441rem',
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        // Component
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Badges
        rare: 'hsl(var(--rare))',
        super: 'hsl(var(--super))',
        epic: 'hsl(var(--epic))',
        legendary: 'hsl(var(--legendary))',
      },
    },
  },
  plugins: [],
};
export default config;
