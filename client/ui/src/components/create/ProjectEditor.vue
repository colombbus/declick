<template lang="pug">
div
  h3
    | Nouveau projet
  form
    .form-group
      label(for='project-edition-project-name')
        | nom du projet
      input#project-edition-project-name.form-control(
        v-model='name'
        type='text'
      )
    .checkbox
      label
        input(v-model='isPublic' type='checkbox')
        | rendre le projet public
    .form-group
      label(for='project-edition-scene-width')
        | largeur de la scène (pixels)
      input#project-edition-scene-width.form-control(
        v-model='sceneWidth'
        type='text'
      )
    .form-group
      label(for='project-edition-scene-height')
        | hauteur de la scène (pixels)
      input#project-edition-scene-height.form-control(
        v-model='sceneHeight'
        type='text'
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
  data () {
    return {
      name: '',
      isPublic: false,
      sceneWidth: '',
      sceneHeight: '',
      description: '',
      instructions: '',
      mainProgramId: null,
      resources: null
    }
  },
  async created () {
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
      media_type: 'text/vnd.colombbus.declick.script'
    })
    this.resources = resources
  },
  methods: {
    async updateProject () {
      let data = {
        name: this.name,
        isPublic: this.isPublic,
        sceneWidth: this.sceneWidth,
        sceneHeight: this.sceneHeight,
        description: this.description,
        instructions: this.instructions,
        mainProgramId: this.mainProgramId
      }
      let truc = await this.$store.dispatch('updateProject', {
        id: this.params.project.id,
        data
      })
      // console.debug(truc)
      this.params.project.name = this.name
      this.params.project.isPublic = this.isPublic
      this.params.project.sceneWidth = this.sceneWidth
      this.params.project.sceneHeight = this.sceneHeight
      this.params.project.description = this.description
      this.params.project.instructions = this.instructions
      this.params.project.mainProgramId = this.mainProgramId
      this.showProjectDetails()
    },
    showProjectDetails () {
      this.$emit('showView', {
        view: 'ProjectDetails',
        params: {project: this.params.project}
      })
    }
  }
}
</script>
