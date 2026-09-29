import { computed, onBeforeUnmount, ref } from 'vue'
import { kinds, maxFiles, startingFiles, uploads, type DriveFile, type DriveKind, type DriveLayout, type DriveSort } from './files'

export interface TrashedFile {
  file: DriveFile
  index: number
}

const sorters: Record<DriveSort, (a: DriveFile, b: DriveFile) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  kind: (a, b) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind) || a.name.localeCompare(b.name),
  size: (a, b) => b.size - a.size,
}

export function useDrive() {
  const files = ref<DriveFile[]>([...startingFiles])
  const trash = ref<TrashedFile[]>([])
  const layout = ref<DriveLayout>('grid')
  const filter = ref<DriveKind | 'all'>('all')
  const sort = ref<DriveSort>('name')
  const expandedId = ref<number | null>(null)
  const toast = ref<TrashedFile | null>(null)
  let nextId = 100
  let uploadCount = 0
  let toastTimer: ReturnType<typeof setTimeout> | undefined

  const visibleFiles = computed(() => files.value
    .filter(file => filter.value === 'all' || file.kind === filter.value)
    .sort(sorters[sort.value]))

  const usedStorage = computed(() => files.value.reduce((total, file) => total + file.size, 0))
  const canUpload = computed(() => files.value.length < maxFiles)

  function toggleExpanded(file: DriveFile) {
    expandedId.value = expandedId.value === file.id ? null : file.id
  }

  function showToast(trashed: TrashedFile | null) {
    clearTimeout(toastTimer)
    toast.value = trashed
    if (trashed) toastTimer = setTimeout(() => showToast(null), 4000)
  }

  function moveToTrash(file: DriveFile) {
    const index = files.value.findIndex(item => item.id === file.id)
    if (index === -1) return
    files.value.splice(index, 1)
    const trashed = { file, index }
    trash.value.push(trashed)
    if (expandedId.value === file.id) expandedId.value = null
    showToast(trashed)
  }

  function undo() {
    const trashed = toast.value
    if (!trashed) return
    trash.value = trash.value.filter(item => item !== trashed)
    files.value.splice(trashed.index, 0, trashed.file)
    showToast(null)
  }

  function upload() {
    if (!canUpload.value) return
    const next = uploads[uploadCount++ % uploads.length]
    if (next) files.value.unshift({ id: nextId++, ...next, modified: 'Just now' })
  }

  function reset() {
    files.value = [...startingFiles]
    trash.value = []
    layout.value = 'grid'
    filter.value = 'all'
    sort.value = 'name'
    expandedId.value = null
    showToast(null)
  }

  onBeforeUnmount(() => clearTimeout(toastTimer))

  return {
    trash,
    layout,
    filter,
    sort,
    expandedId,
    toast,
    visibleFiles,
    usedStorage,
    canUpload,
    toggleExpanded,
    moveToTrash,
    undo,
    upload,
    reset,
  }
}
