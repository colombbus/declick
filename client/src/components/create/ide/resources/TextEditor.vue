<template lang="pug">
.editor
  .editor__disabled-message(v-if='!enabled') {{ $t('message.editor.no-program-opened') }}
  .editor__wrapper(v-show='enabled' ref="editor")
</template>

<script>
import * as ace from 'brace'
import { mapActions, mapState, mapGetters } from 'vuex'
import { debounce } from 'underscore'
import Favico from 'favico.js'
import 'brace/mode/javascript'
import 'brace/ext/modelist'
import 'brace/ext/themelist'
import 'brace/theme/twilight'

export default {
  props: { programName: String, needSave: Boolean },
  data() {
    return {
      favicon: new Favico({
        animation: 'slide',
        // fontFamily: 'Font Awesome 5 Free',
        fontStyle: 'bold',
        position: 'up',
        // badge: '\f00c',
        // bgColor: '#5CB85C',
        bgColor: '#e32c20',
        textColor: '#fff',

        //         var favicon=new Favico({
        //     fontFamily : 'FontAwesome',
        //     elementId : 'badgeFont'
        // });
        // favicon.badge('\f0a2');
      }),
    }
  },
  created() {
    this.$nextTick(() => this.createEditor())
  },
  mounted() {},
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
      this.editSession.on(
        'change',
        debounce(() => {
          // this.favicon.badge('\f00c')
          this.favicon.badge('*')
          this.setCurrentProgramContent({
            id: this.currentProgramName(),
            content: this.editSession.getValue(),
          })
        }, 300),
      )
    },
    ...mapActions(['setCurrentProgramContent', 'getCurrentProgramContent']),
    ...mapState(['currentProgramName']),
  },
  computed: {
    enabled() {
      return this.currentProgramName
    },
  },
  watch: {
    async programName() {
      const content = await this.getCurrentProgramContent()
      if (
        typeof content !== 'undefined' &&
        typeof this.editSession !== 'undefined'
      ) {
        this.editSession.setValue(content)
      }
    },
    needSave: async function(value) {
      if (value) {
        const name = this.$store.state.currentProgramName
        await this.setCurrentProgramContent({
          id: name,
          content: this.editSession.getValue(),
        })
        this.$emit('save-ended')
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.editor {
  background-color: black;
  color: $white;
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
  .editor__wrapper.ace-editor {
    height: 100%;
  }
}
</style>
