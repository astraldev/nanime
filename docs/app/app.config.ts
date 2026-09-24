export default defineAppConfig({
  socials: {
    npm: 'https://www.npmjs.com/package/nanime',
  },
  header: {
    title: 'nanime',
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
  // Used by the transitions playground. Functions survive here, unlike runtimeConfig.
  nanime: {
    transitions: {
      pop: {
        enter: { opacity: [0, 1], scale: [0.4, 1], rotate: [-12, 0], delay: () => Math.random() * 120, duration: 700, ease: 'outElastic(1, .6)' },
        leave: { opacity: 0, scale: 0.4, rotate: 12, duration: 250, ease: 'in(3)' },
        move: { duration: 700, ease: 'outElastic(1, .6)' },
      },
    },
  },
})
