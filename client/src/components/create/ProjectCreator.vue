<template lang="pug">
.project-creator
  form
    label(for='project-creation-project-name')
      | nom du projet
    project-name
    input#project-creation-project-name.form-control(
      v-model='name'
      type='text'
    )

    label(for="is-public")
      | rendre le projet public
    project-share
    input#is-public(v-model='isPublic' type='checkbox')
    
    label(for='project-creation-scene-width')
      | largeur de la scène en pixels
    project-size
    input#project-creation-scene-width.form-control(
      v-model='sceneWidth'
      type='number'
    )
    label(for='project-creation-scene-height')
      | hauteur de la scène en pixels
    project-size.scene-height
    input#project-creation-scene-height.form-control(
      v-model='sceneHeight'
      type='number'
    )
    label(for='project-creation-description')
      | description
    project-description
    textarea#project-creation-description.form-control(
      v-model='description'
      rows='3'
    )
    label(for='project-creation-instructions')
      | instructions
    project-instruction
    textarea#project-creation-instructions.form-control(
      v-model='instructions'
      rows='3'
    )
    .separator
    .form-action
      button.btn.btn-default(
        @click="$router.go(-1)"
        type='button'
      )
        | annuler
      button.btn.btn-primary(@click='createProject' type='button')
        | créer
</template>

<script>
import CloseRight from '@/assets/images/controls/close.svg?inline'
import ProjectName from '@/assets/images/icons/project-name.svg?inline'
import ProjectShare from '@/assets/images/icons/project-share.svg?inline'
import ProjectSize from '@/assets/images/icons/project-size.svg?inline'
import ProjectLink from '@/assets/images/icons/link.svg?inline'
import ProjectDescription from '@/assets/images/icons/project-description.svg?inline'
import ProjectInstruction from '@/assets/images/icons/project-instruction.svg?inline'

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
    ProjectName,
    ProjectShare,
    ProjectSize,
    ProjectLink,
    ProjectDescription,
    ProjectInstruction,
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.project-creator {
  max-width: 1048px;
  margin-right: auto;
  margin-left: auto;
  .scene-height {
    transform: rotate(90deg);
  }
  form {
    display: grid;
    grid-template-columns: 1fr 36px 1fr;
    gap: $size-2;
    align-items: center;
    margin-bottom: $size-2;
    .separator,
    .form-action {
      grid-column: 1/4;
    }
    .form-action {
      display: flex;
    }
    label {
      font-weight: bold;
      text-align: right;
    }
    input[type='checkbox'] {
      justify-self: start;
    }
  }
}
</style>
