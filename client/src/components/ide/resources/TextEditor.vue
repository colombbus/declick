<template lang="pug">
.editor
  .editor__disabled-message(v-if='!enabled') {{ $t('message.editor.no-program-opened') }}
  .editor__wrapper(v-show='enabled' ref="editor")
</template>

<script>
import * as ace from 'brace'
import { mapActions, mapState, mapGetters } from 'vuex'
import { debounce } from 'underscore'

import 'brace/mode/javascript'
import 'brace/ext/modelist'
import 'brace/ext/themelist'
import 'brace/theme/twilight'

const content = `s = new Sprite();
répéter() {
    if (clavier.droite) {
        s.avancer(10)
    }
    if (clavier.gauche) {
        s.reculer(10)
    }
    if (clavier.haut) {
        s.monter(10)
    }
    if (clavier.bas) {
        s.descendre(10)
    }
}`

export default {
  props: { programId: String },
  created() {
    this.$nextTick(() => this.createEditor())
  },
  methods: {
    createEditor() {
      this.editor = ace.edit(this.$refs.editor)

      // editor options
      this.editor.setTheme(`ace/theme/twilight`)
      this.editor.setShowPrintMargin(false)
      this.editor.setFontSize('20px')
      this.editor.focus()

      // editor session
      this.editSession = this.editor.getSession()
      this.editSession.setMode('ace/mode/javascript')
      this.editSession.setValue(content)

      this.editSession.on(
        'change',
        debounce(() => {
          this.setCurrentCode({
            id: this.currentProgram,
            content: this.editSession.getValue(),
          })
        }, 300),
      )
      this.setCurrentCode({
        id: this.currentProgram,
        content: this.editSession.getValue(),
      })
    },
    ...mapActions(['setCurrentCode']),
    ...mapGetters(['getProgramByName']),
    ...mapState(['currentProgram']),
  },
  computed: {
    enabled() {
      return this.programId
    },
  },
  watch: {
    programId() {
      this.editSession.setValue(this.$store.state.programs.get(this.programId))
      // this.editSession.setValue(this.getProgramByName(this.programId))
    },
  },
}
</script>

<style lang="scss">
.editor {
  background-color: black;
  color: white;
  position: relative;
  &__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  &__disabled-message {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    color: white;
    opacity: 0.3;
  }
}
</style>
