<template lang="pug">
.asset-item(
  v-click-outside='onClickOutside'
  @click='onClick'
  :class="selectedClass"
)
  div(v-if='inputMode === false') {{ name }}
  input(
    v-else
    v-model='inputValue'
    @keyup.enter='endRename'
    @keyup.esc='cancelRename'
    ref='input'
    type='text'
  )
  img(:src="'./'+name+'.png'")
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  props: [
    'name',
    'selected',
  ],
  data () {
    return {
      inputMode: false,
      inputValue: null,
      selectedMode: null,
      onKeyUp: null,
    }
  },
  computed: {
    selectedClass () {
      switch (this.selectedMode) {
        case 'active':
          return 'asset-item--selected-active'
        case 'passive':
          return 'asset-item--selected-passive'
        default:
          return null
      }
    },
  },
  created () {
    this.onKeyUp = event => {
      if (event.keyCode === 46) {
        this.onPressDelete()
      }
    }
    document.addEventListener('keyup', this.onKeyUp)
  },
  destroyed () {
    document.removeEventListener('keyup', this.onKeyUp)
  },
  watch: {
    selected (value) {
      this.selectedMode = value ? 'active' : null
    },
  },
  methods: {
    onClick () {
      if (this.selectedMode === 'active' && !this.inputMode) {
        this.startRename()
      } else if (this.selectedMode === 'passive') {
        this.selectedMode = 'active'
      } else if (!this.selected) {
        this.select()
      }
    },
    onClickOutside () {
      if (this.inputMode) {
        this.endRename()
      }
      if (this.selectedMode === 'active') {
        this.selectedMode = 'passive'
      }
    },
    onPressDelete () {
      if (!this.inputMode && this.selectedMode === 'active') {
        this.destroy()
      }
    },
    select () {
      this.$emit('select')
    },
    startRename () {
      this.inputMode = true
      this.inputValue = this.name
      this.$nextTick(() => this.$refs.input.focus())
    },
    cancelRename () {
      this.inputMode = false
    },
    endRename () {
      if (this.inputValue.length > 0) {
        this.$emit('rename', this.inputValue)
      }
      this.inputMode = false
    },
    destroy () {
      this.$emit('destroy')
    },
  },
  directives: {
    ClickOutside,
  },
}
</script>

<style lang="sass">
@import '~@/assets/styles/mixins'

.asset-item
  margin: 8px
  padding: 4px
  width: 90px
  height: 90px
  border: 1px solid transparent
  overflow: hidden
  font-size: 0.8em
  background-color: #FFFFFF
  word-wrap: break-word
  cursor: pointer
  text-align: center
  position: relative
  &--selected-passive
    background: #ddd6dd
  &--selected-active
    color: #FFFFFF
    background-color: #E47637
  &:hover

.asset-item > div
  padding-bottom: 2px
  margin-bottom: 5px
  user-select: none

.asset-item > input
  margin-bottom: 4px
  padding: 0
  padding-bottom: 2px
  border: none
  border-bottom: 1px solid #a3a3a3
  font-size: inherit
  color: inherit
  background: transparent
  outline: 0

.asset-item > img
  width: 65px
  opacity: .6
  &:hover
    opacity: 1

.asset-item--selected-active> img
    opacity: 1
</style>
