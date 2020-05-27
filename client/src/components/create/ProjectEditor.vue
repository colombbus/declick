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
      router-link.btn.btn-default(:to="`/create/${$route.params.id}/show`") annuler
      button.btn.btn-primary(@click='updateProject' type='button')
        | enregistrer les modifications
</template>

<script>
import { mapActions } from 'vuex'
import Api from '@/api'
import ProjectName from '@/assets/images/icons/project-name.svg?inline'
import ProjectShare from '@/assets/images/icons/project-share.svg?inline'
import ProjectSize from '@/assets/images/icons/project-size.svg?inline'
import ProjectLink from '@/assets/images/icons/link.svg?inline'
import ProjectDescription from '@/assets/images/icons/project-description.svg?inline'
import ProjectInstruction from '@/assets/images/icons/project-instruction.svg?inline'
import ProjectMainfile from '@/assets/images/icons/project-mainfile.svg?inline'
export default {
  data() {
    return {
      name: '',
      isPublic: false,
      sceneWidth: '',
      sceneHeight: '',
      description: '',
      instructions: '',
      mainProgramId: null,
      resources: [],
    }
  },
  async created() {
    const project = await this.getProject({ id: this.$route.params.id })
    this.name = project.name
    this.isPublic = project.isPublic
    this.sceneWidth = project.sceneWidth
    this.sceneHeight = project.sceneHeight
    this.description = project.description
    this.instructions = project.instructions
    this.mainProgramId = project.mainProgramId
    const resources = await Api.getAllProjectResources(project.id)
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
        id: this.$route.params.id,
        data,
      })
      this.$router.go(-1)
    },
    ...mapActions(['getProject']),
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
    padding: $size-1;
    label {
      font-weight: bold;
      text-align: right;
    }
  }
  .checkbox input {
    justify-self: start;
  }

  textarea {
    resize: vertical;
  }
  .scene-height {
    transform: rotate(90deg);
  }

  div.form-action {
    display: flex;
  }

  input[type='checkbox'] {
    border: 1px solid $cab-sav;
  }

  textarea,
  input[type='text'],
  input[type='number'],
  select {
    font-family: 'Arial', sans-serif;
    border: 1px solid $cab-sav;
    border-radius: $size-1;
    padding: $size-2;
  }
}
</style>
