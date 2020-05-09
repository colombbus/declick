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
/* eslint-disable */
import PreviewBar from './PreviewBar.vue'

export default {
  props: ['helpVisible'],
  components: {
    PreviewBar,
  },
  mounted() {
    let el = document.getElementsByClassName('preview__canvas')[0]
  },
}
</script>

<style lang="scss">
.preview {
  position: relative;
  // display: grid;
  // height: 100%;
  width: 100%;
  padding: 9px;
  box-sizing: border-box;
  grid-template-rows: 1fr auto;
}

.preview__canvas_container {
  background-color: white;
  position: absolute;
  top: 0;
  bottom: 54px;
  left: 0;
}

.preview__canvas {
  height: 100%;
  width: 100%;
}
.preview-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
