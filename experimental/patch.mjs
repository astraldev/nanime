import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const core = join(here, '..', 'src', 'runtime', 'app', 'experimental', 'core')
const manifest = createRequire(import.meta.url).resolve('animejs/package.json')
const { version } = JSON.parse(readFileSync(manifest, 'utf8'))
const modules = join(dirname(manifest), 'dist', 'modules')
const patch = join(here, 'patches', `animejs@${version}.patch`)

const files = [
  'layout/layout.js',
  'core/helpers.js',
  'core/consts.js',
  'core/globals.js',
  'core/targets.js',
  'core/values.js',
  'core/transforms.js',
  'core/colors.js',
  'easings/eases/parser.js',
  'easings/none.js',
]

if (process.argv[2] === 'create') {
  const diff = files.map((file) => {
    const result = spawnSync('git', ['diff', '--no-index', '--no-color', '--src-prefix=a/', '--dst-prefix=b/', join(modules, file), join(core, file)], { encoding: 'utf8' })
    return result.stdout.replaceAll(`a${join(modules, file)}`, `a/${file}`).replaceAll(`b${join(core, file)}`, `b/${file}`)
  }).join('')
  mkdirSync(dirname(patch), { recursive: true })
  writeFileSync(patch, diff)
}
else {
  if (!existsSync(patch)) throw new Error(`[nanime] no patch for animejs@${version}; regenerate it against this version`)
  for (const file of files) cpSync(join(modules, file), join(core, file), { recursive: true })
  const result = spawnSync('git', ['apply', '--directory=src/runtime/app/experimental/core', patch], { cwd: join(here, '..'), encoding: 'utf8' })
  if (result.status !== 0) throw new Error(`[nanime] patch does not apply to animejs@${version}:\n${result.stderr}`)
  writeFileSync(join(core, 'layout', 'layout.d.ts'), `import type { DOMTargetSelector } from 'animejs'
import type { AutoLayout, AutoLayoutParams } from 'animejs/layout'
import type { TrackTargetsOnlyOptions } from '../../../public/types/features'

export declare function createLayout(root: DOMTargetSelector, params?: AutoLayoutParams & TrackTargetsOnlyOptions): AutoLayout
`)
}
