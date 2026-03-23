import { defineConfig, presetUno, presetAttributify, presetIcons, transformerDirectives } from 'unocss'

// ─── Primitive palettes ───────────────────────────────────────────────────────

const neutral = {
  0:   '#FFFFFF',
  50:  '#F7F7F7',
  100: '#EFEFEF',
  200: '#DEDEDE',
  300: '#C8C8C8',
  400: '#A8A8A8',
  500: '#888888',
  600: '#676767',
  700: '#505050',
  800: '#3B3B3B',
  900: '#292929',
}

const red = {
  50:  '#FAD6D3',
  100: '#F5B5B0',
  200: '#EE9189',
  300: '#E76D62',
  400: '#DF463C',
  500: '#C83028',
  600: '#A62520',
  700: '#831C18',
  800: '#611410',
  900: '#450E0A',
}

// ─── Config ───────────────────────────────────────────────────────────────────

export default defineConfig({
  transformers: [transformerDirectives()],

  presets: [
    presetUno({ dark: 'class' }),
    presetAttributify(),
    presetIcons({
      scale: 1,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],

  theme: {
    // Breakpoints — mobile-first
    breakpoints: {
      mobile: '375px',
      md: '768px',
      lg: '1280px',
    },

    colors: {
      neutral,
      red,
      white: '#FFFFFF',
      black: '#000000',

      // Semantic tokens — reference CSS vars, auto-switch with .dark
      text: {
        DEFAULT: 'var(--color-text-default)',
        muted:   'var(--color-text-muted)',
        link:    'var(--color-text-link)',
      },
      surface: {
        background: 'var(--color-surface-background)',
        subtle:     'var(--color-surface-subtle)',
        card:       'var(--color-surface-card)',
        inverse:    'var(--color-surface-inverse)', // always dark, never overridden in .dark
        brand:      'var(--color-surface-brand)',
      },
      interactive: {
        subtle: 'var(--color-interactive-subtle)',
      },
    },

    // Typography — each token is a CSS var that changes at breakpoints via preflights
    fontSize: {
      'hero':             ['var(--type-hero)',             { lineHeight: 'var(--type-hero-lh)' }],
      'page-title':       ['var(--type-page-title)',       { lineHeight: 'var(--type-page-title-lh)' }],
      'section-title':    ['var(--type-section-title)',    { lineHeight: 'var(--type-section-title-lh)' }],
      'subsection-title': ['var(--type-subsection-title)', { lineHeight: 'var(--type-subsection-title-lh)' }],
      'body-large':       ['var(--type-body-large)',       { lineHeight: 'var(--type-body-large-lh)' }],
      'body':             ['var(--type-body)',             { lineHeight: 'var(--type-body-lh)' }],
      'body-small':       ['var(--type-body-small)',       { lineHeight: 'var(--type-body-small-lh)' }],
      'caption':          ['var(--type-caption)',          { lineHeight: 'var(--type-caption-lh)' }],
    },

    // Spacing — Figma sp-{px} naming alongside UnoCSS defaults
    spacing: {
      'sp-2':   '2px',
      'sp-4':   '4px',
      'sp-8':   '8px',
      'sp-12':  '12px',
      'sp-16':  '16px',
      'sp-20':  '20px',
      'sp-24':  '24px',
      'sp-32':  '32px',
      'sp-40':  '40px',
      'sp-48':  '48px',
      'sp-56':  '56px',
      'sp-64':  '64px',
      'sp-80':  '80px',
      'sp-96':  '96px',
      'sp-120': '120px',
      'sp-160': '160px',
    },

    // Border radius — Figma rd-{px} naming
    borderRadius: {
      'rd-4':   '4px',
      'rd-8':   '8px',
      'rd-12':  '12px',
      'rd-16':  '16px',
      'rd-24':  '24px',
      'rd-32':  '32px',
      'rd-200': '200px', // pill — used in buttons
      'rd-full': '9999px',
    },
  },

  preflights: [
    {
      getCSS: () => `
        /* ── Typography: mobile-first CSS vars, scale up at breakpoints ──────── */
        :root {
          /* Mobile defaults */
          --type-hero:              48px;  --type-hero-lh:              56px;
          --type-page-title:        32px;  --type-page-title-lh:        40px;
          --type-section-title:     24px;  --type-section-title-lh:     32px;
          --type-subsection-title:  18px;  --type-subsection-title-lh:  28px;
          --type-body-large:        18px;  --type-body-large-lh:        26px;
          --type-body:              16px;  --type-body-lh:              24px;
          --type-body-small:        12px;  --type-body-small-lh:        20px;
          --type-caption:           10px;  --type-caption-lh:           16px;
        }
        @media (min-width: 768px) {
          :root {
            /* Tablet */
            --type-hero:              64px;  --type-hero-lh:              72px;
            --type-page-title:        40px;  --type-page-title-lh:        52px;
            --type-section-title:     28px;  --type-section-title-lh:     36px;
            --type-subsection-title:  22px;  --type-subsection-title-lh:  30px;
            --type-body-large:        20px;  --type-body-large-lh:        28px;
          }
        }
        @media (min-width: 1280px) {
          :root {
            /* Desktop */
            --type-hero:              80px;  --type-hero-lh:              88px;
            --type-page-title:        56px;  --type-page-title-lh:        72px;
            --type-section-title:     32px;  --type-section-title-lh:     40px;
            --type-subsection-title:  24px;  --type-subsection-title-lh:  32px;
            --type-body-large:        24px;  --type-body-large-lh:        28px;
          }
        }

        /* ── Primitive scales & spacing as CSS vars ───────────────────────────── */
        :root {
          /* Neutral */
          --neutral-0:   #FFFFFF;
          --neutral-50:  #F7F7F7;
          --neutral-100: #EFEFEF;
          --neutral-200: #DEDEDE;
          --neutral-300: #C8C8C8;
          --neutral-400: #A8A8A8;
          --neutral-500: #888888;
          --neutral-600: #676767;
          --neutral-700: #505050;
          --neutral-800: #3B3B3B;
          --neutral-900: #292929;

          /* Red */
          --red-50:  #FAD6D3;
          --red-100: #F5B5B0;
          --red-200: #EE9189;
          --red-300: #E76D62;
          --red-400: #DF463C;
          --red-500: #C83028;
          --red-600: #A62520;
          --red-700: #831C18;
          --red-800: #611410;
          --red-900: #450E0A;

          /* Spacing */
          --sp-2:    2px;  --sp-4:    4px;  --sp-8:   8px;   --sp-12:   12px;
          --sp-16:  16px;  --sp-20:  20px;  --sp-24:  24px;  --sp-32:   32px;
          --sp-40:  40px;  --sp-48:  48px;  --sp-56:  56px;  --sp-64:   64px;
          --sp-80:  80px;  --sp-96:  96px;  --sp-120: 120px; --sp-160: 160px;

          /* Border radius */
          --rd-4:    4px;  --rd-8:    8px;  --rd-12: 12px; --rd-16:  16px;
          --rd-24:  24px;  --rd-32:  32px;  --rd-200: 200px; --rd-full: 9999px;

          /* ── Semantic tokens — LIGHT MODE ─────────────────────────────────── */
          --color-text-default:       var(--neutral-900);
          --color-text-muted:         var(--neutral-500);
          --color-text-link:          var(--red-600);

          --color-surface-background: var(--neutral-0);
          --color-surface-subtle:     var(--neutral-50);
          --color-surface-card:       var(--neutral-0);
          --color-surface-inverse:    #1E1E1E; /* intentionally static — same in dark mode */
          --color-surface-brand:      var(--neutral-900);

          --color-interactive-subtle: var(--neutral-100);
        }

        /* ── Semantic tokens — DARK MODE (.dark on <html> via @nuxtjs/color-mode) */
        .dark {
          --color-text-default:       var(--neutral-0);
          --color-text-muted:         var(--neutral-400);
          --color-text-link:          var(--red-300);

          --color-surface-background: var(--neutral-900);
          --color-surface-subtle:     var(--neutral-800);
          --color-surface-card:       var(--neutral-800);
          /* --color-surface-inverse: intentionally NOT overridden — stays #1E1E1E */
          --color-surface-brand:      var(--neutral-0);

          --color-interactive-subtle: var(--neutral-700);
        }
      `,
    },
  ],
})
