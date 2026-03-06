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
})
