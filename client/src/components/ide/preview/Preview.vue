<template lang="pug">
.preview
  .preview__canvas_container
    canvas.preview__canvas
  preview-bar(
    @toggle-help="$emit('toggle-help')"
    :helpVisible='helpVisible'
  )
</template>

<script>
import PreviewBar from './PreviewBar.vue'
import DeclickRuntime from '../../../../../runtime/lib/declick-runtime'
import DeclickObjects from '../../../../../objects/lib/declick-objects'

export default {
  props: ['helpVisible', 'code'],
  data() {
    return {
      intialized: false,
    }
  },
  components: {
    PreviewBar,
  },
  watch: {
    async code(value) {
      if (!this.initialized) {
        await DeclickRuntime.initDisplay(
          document.getElementsByClassName('preview__canvas')[0],
          document.getElementsByClassName('preview__canvas_container')[0],
        )
        const objects = await DeclickObjects.load('fr')
        await DeclickRuntime.initialize('fr', objects)
        this.initialized = true
      }
      DeclickRuntime.reset()
      await DeclickRuntime.startGraphics()
      await DeclickRuntime.executeCode(value)
    },
  },
}
</script>

<style lang="scss">
.preview {
  display: grid;
  height: 100%;
  width: 100%;
  padding: 9px;
  box-sizing: border-box;
  grid-template-rows: 1fr auto;
}

.preview__canvas_container {
  justify-self: stretch;
  align-self: stretch;
  background-color: white;
}

.preview__canvas {
  height: 100%;
  width: 100%;
}
</style>
