<template>
  <div class="text-editor">
    <div class="editor" ref="editor"></div>
  </div>
</template>

<script>
import * as ace from 'brace'

import 'brace/mode/javascript'
import 'brace/theme/twilight'

export default {
  data () {
    return {}
  },
  created () {
    this.$nextTick(this.createEditor)
  },
  methods: {
    /* create markdown editor */
    createEditor () {
      this.editor = ace.edit(this.$refs.editor)
      this.editSession = this.editor.getSession()
      this.selection = this.editSession.getSelection()
      this.undoManager = this.editSession.getUndoManager()

      // editor options
      this.editor.setTheme(`ace/theme/twilight`)

      this.editor.$blockScrolling = Infinity
      this.editor.setShowPrintMargin(false)
      this.editor.setShowFoldWidgets(false)
      this.editor.setBehavioursEnabled(false)

      // editor session options
      this.editSession.setMode('ace/mode/javascript')
      this.editSession.setUseWrapMode(true)

      // insert content
      this.editSession.setValue('content')

      this.editor.focus()
    }
  }
}
</script>

<style lang="css" scope>
.editor {
  height: 80vh;
}
</style>

