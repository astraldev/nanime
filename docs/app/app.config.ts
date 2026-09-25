export default defineAppConfig({
  socials: {
    npm: 'https://www.npmjs.com/package/nanime',
  },
  header: {
    title: 'nanime',
  },
  search: {
    fts: true,
  },
  toc: {
    title: 'Table of content',
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
  // Used by the transitions playground and the custom styles demo. Functions survive here, unlike runtimeConfig.
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
