<template lang="pug">
.program-list
  .program-list__content
    program-item(
      v-for='program in programs'
      @select='select(program.id)'
      @rename='name => renameProgram(program.id, name)'
      @destroy='destroyProgram(program.id)'
      :key='program.id'
      :name='program.file_name'
      :selected='selectedId === program.id'
      :id='program.id'
    )
  .program-list__controls
    button.program-list__new(@click='createProgram' type='button')
    button.program-list__delete(@click='destroySelectedProgram' type='button')
</template>

<script>
import ProgramItem from './ProgramItem.vue'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      selectedId: null,
    }
  },
  props: {
    programs: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    select(id) {
      this.$nextTick(() => (this.selectedId = id))
      const name = this.programs.find(program => program.id === id).file_name
      this.setCurrentProgramName({ name })
      // this.setCurrentProgramContent({ id: name, content: this.getProjetResourceContent() })
      this.$emit('select', name)
    },
    async renameProgram(id, newName) {
      this.programs.find(program => program.id === id).file_name = newName
      console.log(id)
      // TODO check if name exists
      await this.updateProjetResource({ id, file_name: newName })
      // this.programs = this.programs.filter(program => program.id !== this.selectedId)
    },
    async createProgram() {
      const name = this.generateName()
      const resource = await this.createProjetResource({ id: name })
      this.setCurrentProgramContent({ id: name, content: '' })
      this.programs.push({ id: resource.id, file_name: name })
      this.select(resource.id)
    },
    async destroySelectedProgram() {
      const [{ id }] = this.programs.filter(program => {
        if (program.id === this.selectedId) {
          return program.id
        }
      })
      await this.deleteProjetResource({ id })
      this.programs = this.programs.filter(
        program => program.id !== this.selectedId,
      )
      if (this.selectedId === this.selectedId) {
        this.selectedId = null
      }
    },
    generateName() {
      let i = 1
      const name = index => this.$t('pattern.program.name', { index })
      while (this.programs.some(program => program.file_name === name(i))) {
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
    ...mapActions([
      'setCurrentProgramName',
      'setCurrentProgramContent',
      'getProjetResourceContent',
      'createProjetResource',
      'deleteProjetResource',
      'updateProjetResource',
    ]),
  },
  computed: {
    orderedPrograms() {
      const self = this
      return self.programs.sort((a, b) => a.name.localeCompare(b.file_name))
    },
  },
  components: {
    ProgramItem,
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/mixins';

.program-list {
  width: 230px;
  display: grid;
  height: 100%;
  grid-template-rows: 1fr auto;
}

.program-list__content {
  overflow: auto;
}

.program-list__controls {
  @include items-hgap(9px);

  display: flex;
  height: 36px;
  padding: 9px;
  flex-direction: row;
  justify-content: flex-end;
}

.program-list__controls > * {
  height: 36px;
  width: 36px;
}

.program-list {
  &__new {
    @include image-button('~@/assets/images/controls/new.svg');
  }

  &__delete {
    @include image-button('~@/assets/images/controls/delete.svg');
  }
}
</style>
