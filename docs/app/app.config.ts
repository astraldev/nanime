export default defineAppConfig({
  socials: {
    npm: 'https://www.npmjs.com/package/nanime',
  },
  header: {
    title: 'nanime',
  },
  ui: {
    header: {
      slots: {
        container: 'relative',
        center: 'absolute left-1/2 -translate-x-1/2',
      },
    },
    page: {
      compoundVariants: [
        {
          left: true,
          right: false,
          class: {
            root: 'lg:grid-cols-[minmax(0,11fr)_minmax(0,39fr)]',
            left: 'lg:col-span-1',
            center: 'lg:col-span-1',
          },
        },
        {
          left: false,
          right: true,
          class: {
            root: 'lg:grid-cols-[minmax(0,77fr)_minmax(0,23fr)]',
            center: 'lg:col-span-1',
            right: 'lg:col-span-1',
          },
        },
      ],
    },
    prose: {
      h2: {
        slots: {
          base: 'mt-16 mb-6 pt-12 border-t border-default text-2xl font-semibold tracking-tight',
        },
      },
      h3: {
        slots: {
          base: 'mt-10 mb-4 text-lg font-semibold',
        },
      },
      h4: {
        slots: {
          base: 'mt-8 mb-2 text-base font-semibold',
        },
      },
      p: 'my-5 text-base/7 text-pretty max-w-[70ch]',
      ul: 'list-disc ps-6 my-5 max-w-[70ch] marker:text-(--ui-border-accented)',
      ol: 'list-decimal ps-6 my-5 max-w-[70ch] marker:text-muted',
      li: 'my-2 ps-1.5 text-base/7 [&>ul]:my-0',
      table: {
        slots: {
          root: 'relative my-8 overflow-x-auto rounded-md border border-muted outline-primary/25 focus-visible:outline-3',
        },
      },
      th: 'py-3 px-4 font-medium text-sm text-muted border-b border-muted',
      td: 'py-3 px-4 text-sm align-top border-b border-muted [&_code]:text-xs/5 [&_p]:my-0 [&_p]:leading-6 [&_ul]:my-0 [&_ol]:my-0 [&_ul]:ps-4.5 [&_ol]:ps-4.5 [&_li]:leading-6 [&_li]:my-0.5',
      field: {
        slots: {
          root: 'my-0 py-4',
          container: 'flex items-center gap-2 font-mono text-sm',
          name: 'font-medium text-highlighted',
          description: 'mt-1.5 text-muted text-sm leading-6 [&_code]:text-xs/4 [&_p]:my-0',
        },
      },
      fieldGroup: 'my-8 divide-y divide-muted rounded-md border border-muted px-5',
      callout: {
        slots: {
          base: 'px-4 py-3 my-6 text-sm/6 rounded-md',
        },
        variants: {
          color: {
            info: { base: 'border-info/15 bg-info/5 text-default' },
            warning: { base: 'border-warning/20 bg-warning/5 text-default' },
            success: { base: 'border-success/15 bg-success/5 text-default' },
            error: { base: 'border-error/20 bg-error/5 text-default' },
            primary: { base: 'border-primary/15 bg-primary/5 text-default' },
            neutral: { base: 'border-muted bg-transparent text-default' },
          },
        },
      },
      collapsible: {
        slots: {
          root: 'my-4 rounded-md border border-dashed border-muted px-3 py-2',
          trigger: 'font-mono text-sm text-muted hover:text-default',
          content: '*:first:mt-3 *:last:mb-0 *:my-3',
        },
      },
      codePreview: {
        slots: {
          root: 'my-8',
          preview: 'flex justify-center border border-default relative p-6 rounded-md bg-elevated/30',
        },
      },
      hr: 'border-t border-default my-12',
    },
    contentToc: {
      slots: {
        link: 'text-[13px] py-0.5',
        trigger: 'text-[13px] font-semibold text-highlighted',
      },
    },
  },
  search: {
    fts: true,
  },
  toc: {
    title: 'On this page',
    bottom: {
      title: 'External guides',
      links: [
        {
          icon: 'i-simple-icons-animedotjs',
          label: 'Anime.js',
          to: 'https://animejs.com',
          target: '_blank',
        },
      ],
    },
  },
  github: {
    rootDir: 'docs',
  },
  // Used by the custom styles demo. Functions survive here, unlike runtimeConfig.
  nanime: {
    transitions: {
      pop: {
        enter: { opacity: [0, 1], scale: [0.4, 1], rotate: [-12, 0], delay: () => Math.random() * 120, duration: 700, ease: 'outElastic(1, .6)' },
        leave: { opacity: 0, scale: 0.4, rotate: 12, duration: 250, ease: 'in(3)' },
        move: { duration: 700, ease: 'outElastic(1, .6)' },
      },
      skew: {
        enter: { opacity: [0, 1], x: [-24, 0], skewX: [20, 0], duration: 450, ease: 'out(4)' },
        leave: { opacity: 0, x: 24, skewX: -20, duration: 250, ease: 'in(3)' },
      },
      shake: {
        enter: { opacity: [0, 1], x: [0, -10, 10, -6, 6, 0], duration: 500, ease: 'inOut(2)' },
        leave: { opacity: 0, x: [0, 8, -8, 0], duration: 300, ease: 'in(2)' },
      },
      glow: {
        enter: {
          opacity: [0, 1],
          filter: ['brightness(2.2) drop-shadow(0px 0px 18px rgba(0, 220, 130, 1))', 'brightness(1) drop-shadow(0px 0px 0px rgba(0, 220, 130, 0))'],
          duration: 600,
          ease: 'out(3)',
        },
        leave: {
          opacity: 0,
          filter: 'brightness(2.2) drop-shadow(0px 0px 18px rgba(0, 220, 130, 1))',
          duration: 300,
          ease: 'in(2)',
        },
      },
      explode: {
        enter: { opacity: [0, 1], scale: [0.5, 1], duration: 350, ease: 'outBack(3)' },
        leave: { opacity: 0, scale: 2, filter: ['blur(0px)', 'blur(10px)'], duration: 400, ease: 'out(3)' },
      },
      flip: {
        enter: { opacity: [0, 1], rotateY: [-90, 0], duration: 500, ease: 'out(3)' },
        leave: { opacity: 0, rotateY: 90, duration: 250, ease: 'in(2)' },
      },
    },
  },
})
