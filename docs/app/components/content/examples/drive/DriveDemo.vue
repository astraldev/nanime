<script setup lang="ts">
import { useDrive } from '~/examples/drive/useDrive'
import SceneWindow from '../shared/SceneWindow.vue'
import DriveFileGrid from './DriveFileGrid.vue'
import DriveFilterBar from './DriveFilterBar.vue'
import DriveSidebar from './DriveSidebar.vue'
import DriveToast from './DriveToast.vue'
import DriveToolbar from './DriveToolbar.vue'

const drive = useDrive()
const { trash, layout, filter, sort, expandedId, toast, visibleFiles, usedStorage, canUpload } = drive

const trashArmed = ref(false)
const sidebar = useTemplateRef('sidebar')

function getTrash() {
  return sidebar.value?.trashTarget ?? null
}

function setTrashArmed(armed: boolean) {
  trashArmed.value = armed
}
</script>

<template>
  <SceneWindow
    title="Drive"
    @reset="drive.reset"
  >
    <div class="flex h-[44rem]">
      <DriveSidebar
        ref="sidebar"
        :trash-count="trash.length"
        :trash-armed="trashArmed"
        :used-storage="usedStorage"
      />

      <main class="relative flex min-w-0 flex-1 flex-col">
        <DriveToolbar
          v-model:layout="layout"
          :can-upload="canUpload"
          @upload="drive.upload"
        />
        <DriveFilterBar
          v-model:filter="filter"
          v-model:sort="sort"
        />
        <DriveFileGrid
          :files="visibleFiles"
          :layout="layout"
          :expanded-id="expandedId"
          :trash="getTrash"
          @toggle="drive.toggleExpanded"
          @over="setTrashArmed"
          @trashed="drive.moveToTrash"
        />
        <DriveToast
          :toast="toast"
          @undo="drive.undo"
        />
      </main>
    </div>
  </SceneWindow>
</template>
