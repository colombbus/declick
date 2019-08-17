<template lang="pug">
.program-list
  .program-list__content
    program-item(
      v-for='program in orderedPrograms'
      @select='select(program.id)'
      @rename='name => renameProgram(program.id, name)'
      @destroy='destroyProgram(program.id)'
      :key='program.id'
      :name='program.name'
      :selected='selectedId === program.id'
      :id='program.id'
    )
  .program-list__controls
    button.program-list__new(@click='createProgram' type='button')
    button.program-list__delete(@click='destroySelectedProgram' type='button')
</template>

<script>

import ProgramItem from './ProgramItem.vue'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      programs: [],
      selectedId: null,
    }
  },
  created() {
    this.createProgram()
  },
  mounted() {
    this.select(1)
  },
  methods: {
    select(id) {
      this.$nextTick(() => (this.selectedId = id))

      const name = this.programs.find(program => program.id === id).name
      this.setcurrentProgramName({ name })
      this.$emit('select', name)
    },
    renameProgram(id, newName) {
      this.programs.find(program => program.id === id).name = newName
    },
    createProgram() {
      const id = this.generateId()
      const name = this.generateName()
      this.programs.push({ id, name })
      this.setCurrentProgramContent({ id: name, content: '' })
    },
    destroySelectedProgram() {
      this.destroyProgram(this.selectedId)
    },
    destroyProgram(id) {
      this.programs = this.programs.filter(program => program.id !== id)
      if (this.selectedId === id) {
        this.selectedId = null
      }
    },
    generateName() {
      let i = 1
      const name = index => this.$t('pattern.program.name', { index })
      while (this.programs.some(program => program.name === name(i))) {
        i++
      }
      return name(i)
    },
    generateId() {
      let i = 1
      while (this.programs.some(({ id }) => id === i)) {
        i++
      }
      return i
    },
    ...mapActions(['setcurrentProgramName', 'setCurrentProgramContent']),
  },
  computed: {
    orderedPrograms() {
      const self = this
      return self.programs.sort((a, b) => a.name.localeCompare(b.name))
    },
  },
  components: {
    ProgramItem,
  },
}
</script>

<style lang="sass">
@import '~@/assets/styles/mixins'

.program-list
  width: 230px
  display: grid
  height: 100%
  grid-template-rows: 1fr auto

.program-list__content
  overflow: auto

.program-list__controls
  +items-hgap(9px)
  display: flex
  height: 36px
  padding: 9px
  flex-direction: row
  justify-content: flex-end

.program-list__controls > *
  height: 36px
  width: 36px

.program-list
  &__new
    +image-button('~@/assets/images/controls/new.png')
  &__delete
    +image-button('~@/assets/images/controls/delete.png')
</style>
