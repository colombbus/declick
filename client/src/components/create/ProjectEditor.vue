<template lang="pug">
.project-editor
  form
    .form-group
      label(for='project-edition-project-name')
        | nom du projet
      project-name
      input#project-edition-project-name.form-control(
        v-model='name'
        type='text'
      )
    .checkbox
      label(for='project-edition-is-public')
        | rendre le projet public
      project-share
      input#project-edition-is-public(v-model='isPublic' type='checkbox')
    
    .form-group
      label(for='project-edition-scene-width')
        | largeur de la scène (pixels)
      project-size
      input#project-edition-scene-width.form-control(
        v-model='sceneWidth'
        min="0"
        max="20000"
        type='number'
      )
    .form-group
      label(for='project-edition-scene-height')
        | hauteur de la scène (pixels)
      project-size.scene-height
      input#project-edition-scene-height.form-control(
        v-model='sceneHeight'
        min="0"
        max="20000"
        type='number'
      )
    .form-group
      label(for='project-edition-description')
        | description
      project-description
      textarea#project-edition-description.form-control(
        v-model='description'
        rows='3'
      )
    .form-group
      label(for='project-edition-instructions')
        | instructions
      project-instruction
      textarea#project-edition-instructions.form-control(
        v-model='instructions'
        rows='3'
      )
    .form-group
      label(for='project-edition-main-program-id')
        | programme principal
      project-mainfile
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
    .separator
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
import ProjectName from '@/assets/images/controls/project-name.svg?inline'
import ProjectShare from '@/assets/images/controls/project-share.svg?inline'
import ProjectSize from '@/assets/images/controls/project-size.svg?inline'
import ProjectLink from '@/assets/images/controls/link.svg?inline'
import ProjectDescription from '@/assets/images/controls/project-description.svg?inline'
import ProjectInstruction from '@/assets/images/controls/project-instruction.svg?inline'
import ProjectMainfile from '@/assets/images/controls/project-mainfile.svg?inline'
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
  components: {
    ProjectName,
    ProjectShare,
    ProjectSize,
    ProjectLink,
    ProjectDescription,
    ProjectInstruction,
    ProjectMainfile,
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.project-editor {
  max-width: 1048px;
  margin-left: auto;
  margin-right: auto;

  .form-group,
  .checkbox {
    display: grid;
    grid-template-columns: 1fr 36px 1fr;
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
