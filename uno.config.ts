import { defineConfig, presetWind4, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [presetWind4({ dark: 'class' }), presetAttributify(), presetIcons()],

  theme: {
    colors: {
      neutral: {
        100: '#F5F5F5',
        200: '#D0D0D0',
        300: '#B9B9B9',
        400: '#A1A1A1',
        500: '#8A8A8A',
        600: '#6E6E6E',
        700: '#535353',
        800: '#373737',
        900: '#292929',
      },
      red: {
        100: '#FAD6D3',
        200: '#F5ACA7',
        300: '#F0837A',
        400: '#EB594E',
        500: '#E63022',
        600: '#B8261B',
        700: '#8A1D14',
        800: '#5C130E',
        900: '#450E0A',
      },
    },

    font: {
      heading: '"Geist", ui-sans-serif, system-ui, sans-serif',
      body: '"IBM Plex Serif", ui-serif, Georgia, serif',
    },

    text: {
      hero: { fontSize: '80px', lineHeight: '88px' },
      'page-title': { fontSize: '56px', lineHeight: '72px' },
      'section-title': { fontSize: '32px', lineHeight: '40px' },
      'subsection-title': { fontSize: '24px', lineHeight: '32px' },
      'body-large': { fontSize: '24px', lineHeight: '28px' },
      body: { fontSize: '16px', lineHeight: '24px' },
      'body-small': { fontSize: '12px', lineHeight: '20px' },
      caption: { fontSize: '10px', lineHeight: '16px' },
    },
  },

  rules: [
    ['text-default', { color: 'var(--color-text-default)' }],
    ['text-muted', { color: 'var(--color-text-muted)' }],
    ['text-link', { color: 'var(--color-text-link)' }],
    ['text-inverse', { color: 'var(--color-text-inverse)' }],
    [
      /^(bg|text|border)-(surface|interactive)-([\w-]+)$/,
      ([, utility, group, token]: string[]) => {
        const prop =
          utility === 'bg' ? 'background-color' : utility === 'text' ? 'color' : 'border-color'
        return { [prop]: `var(--color-${group}-${token})` }
      },
    ],
  ],

  preflights: [
    {
      getCSS: () => `
        :root {
          --neutral-100: #F5F5F5;
          --neutral-200: #D0D0D0;
          --neutral-300: #B9B9B9;
          --neutral-400: #A1A1A1;
          --neutral-500: #8A8A8A;
          --neutral-600: #6E6E6E;
          --neutral-700: #535353;
          --neutral-800: #373737;
          --neutral-900: #292929;

          --red-100: #FAD6D3;
          --red-200: #F5ACA7;
          --red-300: #F0837A;
          --red-400: #EB594E;
          --red-500: #E63022;
          --red-600: #B8261B;
          --red-700: #8A1D14;
          --red-800: #5C130E;
          --red-900: #450E0A;

          --font-headings: 'Geist', ui-sans-serif, system-ui, sans-serif;
          --font-body: 'IBM Plex Serif', ui-serif, Georgia, serif;

          --color-text-default: #1A1A1A;
          --color-text-muted: var(--neutral-500);
          --color-text-link: var(--red-500);
          --color-text-inverse: #ffffff;
          --color-surface-background: #ffffff;
          --color-surface-subtle: var(--neutral-100);
          --color-surface-card: var(--neutral-100);
          --color-surface-brand: var(--red-500);
          --color-surface-inverse: var(--neutral-900);
          --color-interactive-subtle: var(--neutral-100);
        }

        .dark {
          --color-text-default: #ffffff;
          --color-text-muted: var(--neutral-300);
          --color-text-link: var(--neutral-200);
          --color-text-inverse: var(--neutral-900);
          --color-surface-background: var(--neutral-900);
          --color-surface-subtle: var(--neutral-900);
          --color-surface-card: var(--neutral-800);
          --color-surface-brand: var(--neutral-600);
          --color-surface-inverse: #ffffff;
          --color-interactive-subtle: var(--neutral-900);
        }
      `,
    },
  ],

  shortcuts: {
    'site-shell': 'min-h-screen flex flex-col',
    'site-main': 'flex-1',

    // outer horizontal breathing room
    'section-outer': 'px-4 md:px-6 xl:px-8',

    // shared grid wrapper
    'section-grid':
      'mx-auto max-w-[1120px] grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 xl:gap-x-8',

    // default content span
    'col-main': 'col-span-4 md:col-start-2 md:col-end-12 xl:col-start-3 xl:col-end-11',

    // wide content span
    'col-wide': 'col-span-4 md:col-start-1 md:col-end-13',

    'section-space': 'py-12 md:py-16 xl:py-24',
    'text-measure': 'max-w-[65ch]',

    // full viewport section
    'full-bleed': 'w-full',
  },
})
