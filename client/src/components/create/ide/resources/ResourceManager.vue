<template lang="pug">
.resource-manager
  text-editor.resource-manager__text-editor(
    :programName="programName"
    :needSave="needSave"
    @save-ended="needSave=false"
  )
  main-bar.resource-manager__main-bar(
    @toggle-help="$emit('toggle-help')"
    @execute="$emit('execute')"
    @save-file-content="needSave = true"
    :helpVisible='helpVisible'
  )
  resource-panel.resource-manager__resource-panel(
    @select="programName = $event"
    )
</template>

<script>
import MainBar from './MainBar.vue'
import ResourcePanel from './ResourcePanel.vue'
import TextEditor from './TextEditor.vue'

export default {
  props: ['helpVisible'],
  components: {
    TextEditor,
    ResourcePanel,
    MainBar,
  },
  data() {
    return {
      programName: null, // has to be setted by $event
      needSave: false,
    }
  },
}
</script>

<style lang="scss">
.resource-manager {
  height: 100%;
  width: 100%;
  display: grid;
  box-sizing: border-box;
  // padding: 9px;
  grid-template-areas: 'text-editor resource-panel' 'main-bar resource-panel';
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  &__text-editor {
    grid-area: text-editor;
  }
  &__main-bar {
    grid-area: main-bar;
  }
  &__resource-panel {
    grid-area: resource-panel;
  }
}
</style>
