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
      cover: {
        purple: '#7a77e5',
        green: '#03973a',
        brown: '#68584e',
        lime: '#95cc76',
      },
    },

    font: {
      heading: '"Geist", ui-sans-serif, system-ui, sans-serif',
      body: '"IBM Plex Serif", ui-serif, Georgia, serif',
    },

    keyframes: {
      'dot-orbit-a':
        '{0%,100%{transform:translate(0,0)}33%{transform:translate(2px,-3px)}66%{transform:translate(-1px,2px)}}',
      'dot-orbit-b':
        '{0%,100%{transform:translate(0,0)}25%{transform:translate(-2px,1px)}60%{transform:translate(3px,2px)}}',
      'dot-orbit-c':
        '{0%,100%{transform:translate(0,0)}40%{transform:translate(1px,3px)}75%{transform:translate(-3px,-1px)}}',
      'dot-pulse': '{0%,100%{opacity:.35}50%{opacity:1}}',
    },
    animation: {
      keyframes: {
        'dot-orbit-a': 'dot-orbit-a',
        'dot-orbit-b': 'dot-orbit-b',
        'dot-orbit-c': 'dot-orbit-c',
        'dot-pulse': 'dot-pulse',
      },
      durations: {
        'dot-orbit-a': '2.8s',
        'dot-orbit-b': '3.6s',
        'dot-orbit-c': '3.1s',
        'dot-pulse': '1.4s',
      },
      timingFns: {
        'dot-orbit-a': 'cubic-bezier(.4,0,.2,1)',
        'dot-orbit-b': 'cubic-bezier(.65,0,.35,1)',
        'dot-orbit-c': 'cubic-bezier(.5,.05,.4,.95)',
        'dot-pulse': 'ease-in-out',
      },
      counts: {
        'dot-orbit-a': 'infinite',
        'dot-orbit-b': 'infinite',
        'dot-orbit-c': 'infinite',
        'dot-pulse': 'infinite',
      },
    },
  },

  rules: [
    ['text-default', { color: 'var(--color-text-default)' }],
    ['text-muted', { color: 'var(--color-text-muted)' }],
    ['bg-text-muted', { 'background-color': 'var(--color-text-muted)' }],
    ['text-subtle', { color: 'var(--color-text-subtle)' }],
    ['text-link', { color: 'var(--color-text-link)' }],
    ['text-inverse', { color: 'var(--color-text-inverse)' }],
    ['text-brand', { color: 'var(--color-text-brand)' }],
    ['bg-brand', { 'background-color': 'var(--color-surface-brand)' }],
    [
      /^(bg|text|border)-(surface|interactive)-([\w-]+)$/,
      ([, utility, group, token]: string[]) => {
        const prop =
          utility === 'bg' ? 'background-color' : utility === 'text' ? 'color' : 'border-color'
        return { [prop]: `var(--color-${group}-${token})` }
      },
    ],
    ['fill-brand', { fill: 'var(--color-text-brand)' }],
    ['fill-background-default', { fill: 'var(--color-surface-background)' }],
    [
      'dot-grid',
      {
        'background-image':
          'radial-gradient(circle, var(--color-dot-grid) 1px, transparent 1px)',
        'background-size': '24px 24px',
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
          --color-text-muted: var(--neutral-600);
          --color-text-subtle: var(--color-text-muted);
          --color-text-link: var(--red-500);
          --color-text-inverse: #ffffff;
          --color-text-brand: var(--red-500);
          --color-surface-background: #ffffff;
          --color-surface-subtle: var(--neutral-100);
          --color-surface-card: var(--neutral-100);
          --color-surface-brand: var(--red-500);
          --color-surface-inverse: var(--neutral-900);
          --color-interactive-subtle: var(--neutral-100);
          --shine-highlight-mid: rgba(255, 255, 255, 0.7);
          --shine-gradient-fade: rgba(255, 255, 255, 0);
          --color-contact-stroke: var(--red-500);
          --color-dot-grid: var(--neutral-200);
          --color-board-grid: var(--neutral-200);
          --color-board-border: var(--neutral-200);
          --color-surface-border: var(--color-board-border);
          /* Alias for app canvas (e.g. framed sections); tracks surface-background in light/dark */
          --color-surface-default: var(--color-surface-background);
        }

        .dark {
          --color-text-default: #ffffff;
          --color-text-muted: var(--neutral-200);
          --color-text-link: var(--neutral-200);
          --color-text-inverse: var(--neutral-900);
          --color-text-brand: #ffffff;
          --color-surface-background: var(--neutral-900);
          --color-surface-subtle: var(--neutral-800);
          --color-surface-card: var(--neutral-800);
          --color-surface-brand: var(--neutral-600);
          --color-surface-inverse: #ffffff;
          --color-interactive-subtle: var(--neutral-900);
          /* Match #292929 RGB so gradient stops don’t interpolate through white */
          --shine-gradient-fade: rgba(41, 41, 41, 0);
          /* Subtle band between neutral-800/700 — reads as depth, not a white glint */
          --shine-highlight-mid: rgba(83, 83, 83, 0.12);
          --color-dot-grid: var(--neutral-700);
          --color-board-grid: var(--neutral-700);
          --color-board-border: var(--neutral-700);
          --color-surface-border: var(--color-board-border);
        }

        .shine-effect {
          position: relative;
          overflow: hidden;
          display: inline-block;
        }

        .shine-effect::after {
          content: '';
          position: absolute;
          inset: -50%;
          pointer-events: none;
          background: linear-gradient(
            120deg,
            transparent 44%,
            var(--shine-gradient-fade) 47%,
            var(--shine-highlight-mid) 50%,
            var(--shine-gradient-fade) 53%,
            transparent 56%
          );
          animation: diagonal-shine 5s linear 1 forwards;
        }

        .shine-effect.shine-effect--played:not(.shine-effect--hover-shine)::after {
          animation: none;
          transform: translate3d(100%, 100%, 0);
        }

        .shine-effect.shine-effect--hover-shine::after {
          animation: diagonal-shine-hover 5s linear 1 forwards;
        }

        @keyframes diagonal-shine {
          0% {
            transform: translate3d(-100%, -100%, 0);
          }

          100% {
            transform: translate3d(100%, 100%, 0);
          }
        }

        @keyframes diagonal-shine-hover {
          0% {
            transform: translate3d(-100%, -100%, 0);
          }

          100% {
            transform: translate3d(100%, 100%, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .shine-effect::after,
          .shine-effect.shine-effect--hover-shine::after {
            animation: none !important;
            transform: none;
          }
        }

        /* Inline flow (not flex) so line breaks respect normal word boundaries and spaces stay natural */
        .wind-lift {
          display: inline;
        }

        .wind-lift__word {
          display: inline;
          white-space: nowrap;
        }

        .wind-lift__unit {
          display: inline-block;
          vertical-align: baseline;
          transform: translateY(var(--wind-rest, 0));
          transition: transform 0.7s ease-out;
          transition-delay: var(--wind-delay, 0ms);
          will-change: transform;
        }

        .wind-lift__unit--space {
          white-space: pre;
        }

        @media (hover: hover) {
          .wind-lift:hover .wind-lift__unit,
          .wind-lift-root:hover .wind-lift__unit {
            transform: translateY(var(--wind-lift, -0.09em));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wind-lift__unit {
            transition: none !important;
            transform: none !important;
            will-change: auto;
          }

          .wind-lift:hover .wind-lift__unit,
          .wind-lift-root:hover .wind-lift__unit {
            transform: none !important;
          }
        }

        .marquee-scroll-up {
          animation: marquee-up 20s linear infinite;
        }

        .marquee-scroll-down {
          animation: marquee-down 20s linear infinite;
        }

        @keyframes marquee-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        @keyframes marquee-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-scroll-up,
          .marquee-scroll-down {
            animation: none !important;
          }
        }

        @keyframes icon-nudge {
          0%, 8%, 100% { transform: rotate(0deg); }
          2% { transform: rotate(-12deg); }
          4% { transform: rotate(10deg); }
          6% { transform: rotate(-6deg); }
        }

        .pulsing-icon {
          transform-origin: center center;
          animation: icon-nudge 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .pulsing-icon {
            animation: none !important;
          }
        }

        .skill-dialog-enter-active,
        .skill-dialog-leave-active {
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        /* Centered modal: no translateX(-50%) — that was for old left-1/2 layout and pulled the overlay left */
        .skill-dialog-enter-from,
        .skill-dialog-leave-to {
          opacity: 0;
          transform: translateY(10px) scale(0.98);
        }
        .skill-dialog-enter-to,
        .skill-dialog-leave-from {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .accordion-enter-active,
        .accordion-leave-active {
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .accordion-enter-from,
        .accordion-leave-to {
          opacity: 0;
          max-height: 0;
        }
        .accordion-enter-to,
        .accordion-leave-from {
          opacity: 1;
          max-height: 600px;
        }
      `,
    },
    {
      getCSS: () => `
        /* Case study media max-width / max-height (see app/utils/caseStudyAspect.ts + CASE_STUDY_MAX_H_REM); TS-only Tailwind h-* are not scanned by Uno. */
        .case-study-mw-xs { max-width: 20rem; }
        .case-study-mw-sm { max-width: 24rem; }
        .case-study-mw-md { max-width: 28rem; }
        .case-study-mh-xs { height: 12rem; }
        .case-study-mh-sm { height: 16rem; }
        .case-study-mh-md { height: 20rem; }
        .case-study-mh-xl { height: 60rem; }
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

    // Index/contact page dot-grid bleed: extends above the header (CSS var, default 5.5rem) and below the section
    'page-dot-bleed':
      'inset-x-0 top-[calc(-1*(var(--site-header-h,5.5rem)+3rem))] bottom-[calc(-1*3rem)] md:top-[calc(-1*(var(--site-header-h,5.5rem)+4rem))] md:bottom-[calc(-1*4rem)] xl:top-[calc(-1*(var(--site-header-h,5.5rem)+6rem))] xl:bottom-[calc(-1*6rem)]',

    // Case study long-form copy: shared scale + unitless leading (1.625) for stable rhythm, same idea as major editorial/article stacks
    'case-study-prose':
      'font-body text-muted text-base leading-[1.625] md:text-lg xl:text-2xl',

    // full viewport section
    'full-bleed': 'w-full',

    // semantic aliases (match site CSS variables in preflights)
    'color-brand': 'text-brand',
    'bg-background-default': 'bg-[var(--color-surface-background)]',

    // desktop header primary nav
    'header-nav-link':
      'font-heading font-bold text-[14px] tracking-[0.02em] text-default no-underline rounded-lg px-2 py-1 transition-colors duration-200 ease-out motion-reduce:transition-none hover:bg-surface-subtle',

    // SectionContact: solid brand in light, transparent + stroke in dark (Portfolio Figma)
    'contact-hero-card':
      'w-full rounded-[32px] md:rounded-[40px] overflow-clip px-6 py-8 md:py-12 flex flex-col items-start gap-10 md:gap-12 bg-surface-brand dark:bg-transparent dark:border-2 dark:border-surface-subtle',
    'contact-hero-title':
      'font-heading font-black text-inverse dark:text-default text-[48px] leading-[56px] md:text-[80px] md:leading-[88px]',
    'contact-door-frame':
      'relative w-full aspect-[144/188] overflow-hidden bg-surface-brand rounded-b-2 px-2 pt-4 pb-3 md:pb-2 dark:bg-transparent dark:border-2 dark:border-t-0 dark:border-surface-subtle',
    'contact-door-icon': 'text-white',
    'contact-door-label':
      'font-body text-base md:text-2xl leading-6 md:leading-7 text-muted',
    'contact-door-label-icon': 'text-muted',
  },
})
