/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        neon: {
          cyan: 'var(--neon-cyan)',
          green: 'var(--neon-green)',
          magenta: 'var(--neon-magenta)',
          amber: 'var(--neon-amber)',
          blue: 'var(--neon-blue)',
        },
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 2px)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) + 2px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'metric-hero': ['2.5rem', { lineHeight: '1', fontWeight: '700' }],
        'metric-lg': ['1.875rem', { lineHeight: '1', fontWeight: '700' }],
        'metric-md': ['1.5rem', { lineHeight: '1', fontWeight: '700' }],
      },
      animation: {
        'live-pulse': 'livePulse 2s ease-in-out infinite',
        'rank-up': 'rankUp 0.6s ease-out',
        'rank-down': 'rankDown 0.6s ease-out',
        'metric-flash': 'metricFlash 0.4s ease-out',
        'slide-in': 'slideInFromBottom 0.3s ease-out',
        'fade-in': 'fadeIn 0.25s ease-out',
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 245, 212, 0.4), 0 0 30px rgba(0, 245, 212, 0.15)',
        'neon-green': '0 0 15px rgba(57, 255, 20, 0.4), 0 0 30px rgba(57, 255, 20, 0.15)',
        'neon-magenta': '0 0 15px rgba(255, 45, 120, 0.4), 0 0 30px rgba(255, 45, 120, 0.15)',
        'card-elevated': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};