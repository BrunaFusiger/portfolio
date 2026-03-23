import { defineConfig, presetWind4, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4({ dark: 'class' }),
    presetAttributify(),
    presetIcons(),
  ],

  theme: {
    colors: {
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#1a1a1a',
        950: '#0a0a0a',
      },
      red: {
        50: '#fff1f2',
        100: '#ffe4e6',
        200: '#fecdd3',
        300: '#fda4af',
        400: '#fb7185',
        500: '#f43f5e',
        600: '#e11d48',
        700: '#be123c',
        800: '#9f1239',
        900: '#881337',
        950: '#4c0519',
      },

      text: {
        default: 'var(--color-text-default)',
        muted: 'var(--color-text-muted)',
        link: 'var(--color-text-link)',
      },
      surface: {
        background: 'var(--color-surface-background)',
        subtle: 'var(--color-surface-subtle)',
        card: 'var(--color-surface-card)',
        brand: 'var(--color-surface-brand)',
      },
      interactive: {
        subtle: 'var(--color-interactive-subtle)',
        muted: 'var(--color-interactive-muted)',
      },
    },

    font: {
      heading: '"Geist", ui-sans-serif, system-ui, sans-serif',
      body: '"IBM Plex Serif", ui-serif, Georgia, serif',
    },

    fontSize: {
      'hero': ['80px', { lineHeight: '88px' }],
      'page-title': ['56px', { lineHeight: '72px' }],
      'section-title': ['32px', { lineHeight: '40px' }],
      'subsection-title': ['24px', { lineHeight: '32px' }],
      'body-large': ['24px', { lineHeight: '28px' }],
      'body': ['16px', { lineHeight: '24px' }],
      'body-small': ['12px', { lineHeight: '20px' }],
      'caption': ['10px', { lineHeight: '16px' }],
    },
  },

  preflights: [
    {
      getCSS: () => `
        :root {
          --neutral-50: #fafafa;
          --neutral-100: #f5f5f5;
          --neutral-200: #e5e5e5;
          --neutral-300: #d4d4d4;
          --neutral-400: #a3a3a3;
          --neutral-500: #737373;
          --neutral-600: #525252;
          --neutral-700: #404040;
          --neutral-800: #262626;
          --neutral-900: #1a1a1a;
          --neutral-950: #0a0a0a;

          --red-50: #fff1f2;
          --red-100: #ffe4e6;
          --red-200: #fecdd3;
          --red-300: #fda4af;
          --red-400: #fb7185;
          --red-500: #f43f5e;
          --red-600: #e11d48;
          --red-700: #be123c;
          --red-800: #9f1239;
          --red-900: #881337;
          --red-950: #4c0519;

          --font-headings: 'Geist', ui-sans-serif, system-ui, sans-serif;
          --font-body: 'IBM Plex Serif', ui-serif, Georgia, serif;

          --color-text-default: var(--neutral-900);
          --color-text-muted: var(--neutral-500);
          --color-text-link: var(--red-600);
          --color-surface-background: #ffffff;
          --color-surface-subtle: var(--neutral-50);
          --color-surface-card: #ffffff;
          --color-surface-brand: var(--neutral-900);
          --color-interactive-subtle: var(--neutral-100);
          --color-interactive-muted: #8a8a8a;
        }

        .dark {
          --color-text-default: #ffffff;
          --color-text-muted: var(--neutral-400);
          --color-text-link: var(--red-400);
          --color-surface-background: var(--neutral-950);
          --color-surface-subtle: var(--neutral-900);
          --color-surface-card: var(--neutral-800);
          --color-surface-brand: #ffffff;
          --color-interactive-subtle: var(--neutral-800);
          --color-interactive-muted: #8a8a8a;
        }
      `,
    },
  ],
})
