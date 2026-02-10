import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/module',
    {
      input: 'integrations/vue/index',
      name: 'integrations/vue/index',
    },
  ],
})
