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

export default {
  props: ['helpVisible'],
  components: {
    PreviewBar,
  },
  mounted() {
    // eslint-disable-next-line no-unused-vars
    let el = document.getElementsByClassName('preview__canvas')[0]
  }
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
  height:100%;
  width:100%;
}
</style>
