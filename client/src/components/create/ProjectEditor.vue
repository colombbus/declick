<template lang="pug">
.project-editor
  h3
    | modification du projet
  form
    fieldset
      .form-group
        label(for='project-edition-project-name')
          | nom du projet
        input#project-edition-project-name.form-control(
          v-model='name'
          type='text'
        )
      .checkbox
        label(for='project-edition-is-public')
          | rendre le projet public
        input#project-edition-is-public(v-model='isPublic' type='checkbox')
      .form-group
        label(for='project-edition-scene-width')
          | largeur de la scène (pixels)
        input#project-edition-scene-width.form-control(
          v-model='sceneWidth'
          min="0"
          max="20000"
          type='number'
        )
      .form-group
        label(for='project-edition-scene-height')
          | hauteur de la scène (pixels)
        input#project-edition-scene-height.form-control(
          v-model='sceneHeight'
          min="0"
          max="20000"
          type='number'
        )
      .form-group
        label(for='project-edition-description')
          | description
        textarea#project-edition-description.form-control(
          v-model='description'
          rows='3'
        )
      .form-group
        label(for='project-edition-instructions')
          | instructions
        textarea#project-edition-instructions.form-control(
          v-model='instructions'
          rows='3'
        )
      .form-group
        label(for='project-edition-main-program-id')
          | programme principal
        select#project-edition-main-program-id.form-control(
          v-if='resources'
          v-model='mainProgramId'
        )
          option(
            v-for='resource in resources'
            v-if="resource.media_type === 'text/vnd.colombbus.declick.script'",
            :value='resource.id',
            :class='{selected: mainProgramId === resource.id}'
          )
            | {{resource.file_name}}
    .form-action
      button.btn.btn-default(
        @click='showProjectDetails'
        type='button'
      )
        | annuler
      | &nbsp;
      button.btn.btn-primary(@click='updateProject' type='button')
        | enregistrer les modifications
</template>

<script>
import Api from '@/api'

export default {
  props: ['params'],
  data() {
    return {
      name: '',
      isPublic: false,
      sceneWidth: '',
      sceneHeight: '',
      description: '',
      instructions: '',
      mainProgramId: null,
      resources: null,
    }
  },
  async created() {
    this.name = this.params.project.name
    this.isPublic = this.params.project.isPublic
    this.sceneWidth = this.params.project.sceneWidth
    this.sceneHeight = this.params.project.sceneHeight
    this.description = this.params.project.description
    this.instructions = this.params.project.instructions
    this.mainProgramId = this.params.project.mainProgramId
    const resources = await Api.getAllProjectResources(this.params.project.id)
    resources.unshift({
      file_name: '<aucun>',
      id: null,
      media_type: 'text/vnd.colombbus.declick.script',
    })
    this.resources = resources
  },
  methods: {
    async updateProject() {
      const data = {
        name: this.name,
        isPublic: this.isPublic,
        sceneWidth: this.sceneWidth,
        sceneHeight: this.sceneHeight,
        description: this.description,
        instructions: this.instructions,
        mainProgramId: this.mainProgramId,
      }
      const storeUpProject = await this.$store.dispatch('updateProject', {
        id: this.params.project.id,
        data,
      })
      // console.debug(storeUpProject)
      this.params.project.name = this.name
      this.params.project.isPublic = this.isPublic
      this.params.project.sceneWidth = this.sceneWidth
      this.params.project.sceneHeight = this.sceneHeight
      this.params.project.description = this.description
      this.params.project.instructions = this.instructions
      this.params.project.mainProgramId = this.mainProgramId
      this.showProjectDetails()
    },
    showProjectDetails() {
      this.$emit('showView', {
        view: 'ProjectDetails',
        params: { project: this.params.project },
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.project-editor {
  max-width: 1048px;
  margin-left: auto;
  margin-right: auto;

  fieldset {
    border: 1px solid $border-color;
    padding: $size-3;
    margin-bottom: $size-3;
  }

  .form-action,
  .form-group,
  .checkbox {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    align-items: center;
    margin-bottom: $size-2;
    label {
      font-weight: bold;
      text-align: right;
    }
  }
  .checkbox input {
    justify-self: start;
  }

  textarea {
    padding: $size-2;
    border-radius: $size-1;
    border: 1px solid $border-color;
  }
}
</style>
