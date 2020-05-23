<template lang="pug">
  #block-editor
    v-blockly(
      workspace="block/workspace.xml"
      toolbox="block/toolbox.xml"
      :options="bOptions"
    )
    text-editor
    vertical-bar
</template>

<script>
/* eslint-disable */
// pacman-loader(color="#e22c20" v-if="loading")
import PacmanLoader from '@/components/navigation/PacmanLoader.vue'
import TextEditor from '@/components/create/ide/resources/TextEditor.vue'
import VBlockly from './VBlockly.vue'
import VerticalBar from './VerticalBar.vue'

// SCRATCH
// controle #ffab19
// mouvement #4c97ff
// apparence #9966ff
// son #d65cd6
// événement #ffd500
// capteur #4cbfe6
// opérateur #40bf4a
// variable #ff8c1a
// mes blocs  #ff6680

// declick_robot

export default {
  data() {
    return {
      loading: true,
      bOptions: {
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.2,
          scaleSpeed: 1.2,
        },
      },
      blocks: 'turtle.json',
    }
  },
  mounted() {
    // this.loading = false
  },
  components: {
    PacmanLoader,
    VBlockly,
    TextEditor,
    VerticalBar,
  },
}
</script>

<style lang="scss">
#block-editor .editor{
  margin-left: 1%;
  z-index: 0;
}
#editor,
#block-editor {
  display: flex;
  height: 100%;
  position: relative;
}
#block-editor {
  width: 100%;
}

.blockly-flex,
.blockly-div {
  z-index: -1;
  height: 100%;
  width: 100%;
}
.blockly-flex,
#block-editor .editor {
  width: 49.5%;
}

.injectionDiv {
  height: 100%;
  position: relative;
  overflow: hidden;
  touch-action: none;
}
.v-spinner {
  position: fixed;
  top: 50%;
}

#block-editor div.editor div.editor__wrapper.ace_editor.ace-twilight.ace_dark {
  height: 100%;
}
.vertical-bar{

  position: absolute;
  left: 49.5%;
  top: 0;
  bottom: 0;
}
</style>