<template lang="pug">
.ide
  transition(name='ide__help')
    help.ide__help(v-show='helpVisible')
  preview.ide__preview(
    v-show="view === 'preview'"
    @toggle-help='toggleHelp'
    :helpVisible='helpVisible'
  )
  resource-manager.ide__resource-manager(
    v-show="view === 'resource-manager'"
    @toggle-help='toggleHelp'
    :helpVisible='helpVisible'
    @execute='execute'
  )
</template>

<script>
import Preview from '@/components/ide/preview/Preview.vue'
import ResourceManager from '@/components/ide/resources/ResourceManager.vue'
import Help from './Help.vue'
import DeclickRuntime from '../../../../runtime/lib/declick-runtime'
import DeclickObjects from '../../../../objects/lib/declick-objects'

import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      view: 'resource-manager', // 'resource-manager' | 'preview'
      helpVisible: false,
      onKeyUp: null,
    }
  },
  created() {
    this.onKeyUp = event => {
      if (event.ctrlKey && event.keyCode === 13) {
        this.toggleView()
      }
    }
    document.addEventListener('keyup', this.onKeyUp)
    DeclickObjects.load('fr').then(objects => {
      DeclickRuntime.initialize('fr', objects)
    })
  },
  destroyed() {
    document.removeEventListener('keyup', this.onKeyUp)
  },
  mounted() {
    DeclickRuntime.initDisplay(
      document.getElementsByClassName('preview__canvas')[0],
      document.getElementsByClassName('preview__canvas_container')[0],
    )
  },
  methods: {
    ...mapGetters(['getCurrentProgramContent']),
    toggleHelp() {
      this.helpVisible = !this.helpVisible
    },
    toggleView() {
      this.view =
        this.view === 'resource-manager' ? 'preview' : 'resource-manager'
    },
    execute() {
      // DeclickRuntime.executeCode(`t = new Texte();
      // t.définirTexte('abracadabra');
      // t.récupérerTexte();`)
      // console.log(this.getCurrentProgramContent());

      // DeclickRuntime.executeCode(this.getCurrentProgramContent())
      DeclickRuntime.reset()
      DeclickRuntime.startGraphics().then(() => {
        DeclickRuntime.executeCode(
          this.$store.state.programs.get(this.$store.state.currentProgramName),
        )
        this.view = 'preview'
      })
    },
  },
  components: {
    Help,
    Preview,
    ResourceManager,
  },
}
</script>

<style lang="scss">
.ide {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-areas: 'help content';
  grid-template-columns: auto 1fr;
  // grid-template-rows: 1fr;
}

.ide__help {
  width: 350px;
  grid-area: help;
}

.ide__preview,
.ide__resource-manager {
  grid-area: content;
}
</style>
