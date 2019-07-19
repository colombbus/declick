<template lang="pug">
.editor(ref="editor")
  .editor__disabled-message(v-show='disabled') {{ $t('message.editor.no-program-opened') }}
</template>

<script>
const content = `t = new Texte()\nt.()`

import * as ace from 'brace'
import 'brace/mode/javascript'
import 'brace/ext/modelist'
import 'brace/ext/themelist'
import 'brace/theme/twilight'

export default {
  props: ['programId'],
  created() {
    this.$nextTick(() => {
      this.createEditor()
    })
  },
  methods: {
    createEditor() {
      this.editor = ace.edit(this.$refs.editor)
      this.editSession = this.editor.getSession()
      // editor options
      this.editor.setTheme(`ace/theme/twilight`)
      this.editSession.setMode('ace/mode/javascript')

      this.editor.setShowPrintMargin(false)
      this.editSession.setValue(content)
      this.editor.focus()
    },
  },
  computed: {
    disabled() {
      return !this.programId
    },
  },
}
</script>

<style lang="scss">
.editor {
}

.editor__disabled-message {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  color: white;
  opacity: 0.3;
}
</style>
