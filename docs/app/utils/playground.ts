import type { NanimeComponentDefaults } from '#nanime/types'

export interface CompareColumn {
  badge: string
  name: string
  lines: string[]
  defaults: NanimeComponentDefaults
}

export interface TuningSlider<Key extends string> {
  key: Key
  label: string
  min: number
  max: number
  step: number
  unit?: string
}
