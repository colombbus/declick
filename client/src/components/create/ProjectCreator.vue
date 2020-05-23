<template lang="pug">
.project-creator
  form
    label(for='project-creation-project-name')
      | nom du projet
    close-right
    input#project-creation-project-name.form-control(
      v-model='name'
      type='text'
    )

    label(for="is-public")
      | rendre le projet public
    close-right
    input#is-public(v-model='isPublic' type='checkbox')
    
    label(for='project-creation-scene-width')
      | largeur de la scène (pixels)
    close-right
    input#project-creation-scene-width.form-control(
      v-model='sceneWidth'
      type='text'
    )
    label(for='project-creation-scene-height')
      | hauteur de la scène (pixels)
    close-right
    input#project-creation-scene-height.form-control(
      v-model='sceneHeight'
      type='text'
    )
    label(for='project-creation-description')
      | description
    close-right
    textarea#project-creation-description.form-control(
      v-model='description'
      rows='3'
    )
    label(for='project-creation-instructions')
      | instructions
    close-right
    textarea#project-creation-instructions.form-control(
      v-model='instructions'
      rows='3'
    )
    
    button.btn.btn-default(
      @click="$emit('showView', 'ProjectList')"
      type='button'
    )
      | annuler
    button.btn.btn-primary(@click='createProject' type='button')
      | créer
</template>

<script>
import CloseRight from '@/assets/images/controls/close.svg?inline'
export default {
  data() {
    return {
      name: '',
      isPublic: false,
      sceneWidth: '',
      sceneHeight: '',
      description: '',
      instructions: '',
    }
  },
  methods: {
    async createProject() {
      const data = {
        name: this.name,
        isPublic: this.isPublic,
        sceneWidth: this.sceneWidth,
        sceneHeight: this.sceneHeight,
        description: this.description,
        instructions: this.instructions,
      }
      await this.$store.dispatch('createProject', { data })
      this.$emit('close')
    },
  },
  components: {
    CloseRight,
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.project-creator {
  max-width: 1048px;
  margin-right: auto;
  margin-left: auto;
  form {
    display: grid;
    grid-template-columns: 1fr 30px 1fr;
    margin-bottom: $size-2;

    label {
      font-weight: bold;
      text-align: right;
      padding-right: $size-2;
    }
  }
}
</style>
