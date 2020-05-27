<template lang="pug">
.project-details
  .panel.panel-default
    table
      tr
        th nom du projet
        td: project-name
        td {{ project.name }}
      tr
        th lien vers l'application
        td: project-link
          | {{ project.name }}
        td
          | lancer 
          router-link(target="_blank" :to="{name: 'execute', params: { projectId: $route.params.id }}") {{ project.name }}
      tr
        th public
        td: project-share
        td {{ project.isPublic ? 'oui' : 'non' }}
      tr
        th largeur de la scène
        td: project-size
        td {{ project.sceneWidth }}
      tr
        th hauteur de la scène
        td: project-size.scene-height
        td {{ project.sceneHeight }}
      tr
        th description
        td: project-description
        td {{ project.description }}
      tr
        th instructions
        td: project-instruction
        td {{ project.instructions }}
      tr
        th programme principal
        td: project-mainfile
        td {{ mainProgramName }}
  .separator
  .form-action
    router-link.btn.btn-default(:to="`/create/${$route.params.id}/edit`") 
      | modifier les informations
    button.btn.btn-default(
      @click="selectAsCurrentProject"
      type='button'
    ) travailler sur ce projet
    button.btn.btn-danger(
      :class="project.isDefault ? 'disabled' : ''"
      :disabled="project.isDefault ? 'disabled' : ''"
      @click="deleteProject"
      type='button'
    ) supprimer
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Api from '@/api'
import ProjectName from '@/assets/images/icons/project-name.svg?inline'
import ProjectShare from '@/assets/images/icons/project-share.svg?inline'
import ProjectSize from '@/assets/images/icons/project-size.svg?inline'
import ProjectLink from '@/assets/images/icons/link.svg?inline'
import ProjectDescription from '@/assets/images/icons/project-description.svg?inline'
import ProjectInstruction from '@/assets/images/icons/project-instruction.svg?inline'
import ProjectMainfile from '@/assets/images/icons/project-mainfile.svg?inline'

export default {
  props: ['params'],
  data() {
    return {
      mainProgramName: "non supporté pour l'instant",
      project: {},
    }
  },
  async mounted() {
    this.getMainProgramName(this.$route.params.id)
    this.project = await this.getProject({ id: this.$route.params.id })
  },
  computed: {
    ...mapState(['currentProject', 'user']),
  },
  methods: {
    async getMainProgramName(id) {
      // TODO : id is the main file of current project / not the id of shown project
      // todo: need request that id
      console.log('getMainProgramName', id)
      if (id === null) {
        return
      }
      console.log(id)
      const resources = await this.getAllProjectResources({ id: parseInt(id) })
      const resource = resources.filter(r => r.id === parseInt(id))
      console.log(resource)
      // this.mainProgramName = file_name
    },
    async selectAsCurrentProject() {
      await this.selectProject({ id: this.project.id })
      this.$emit('close')
    },
    async deleteProject() {
      await Api.deleteProject(this.project.id, this.$store.state.token)
      if (this.currentProject.id === this.project.id) {
        this.selectProject({ id: this.user.defaultProjectId })
      }
      // this.$emit('showView', { view: 'ProjectList' })
    },
    ...mapActions(['selectProject', 'getAllProjectResources', 'getProject']),
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

.project-details {
  max-width: 1048px;
  margin-left: auto;
  margin-right: auto;
  .scene-height {
    transform: rotate(90deg);
  }
  table {
    display: block;
    // border: 1px solid $border-color;
    // padding: $size-2;

    tr {
      display: grid;
      grid-template-columns: 1fr 36px 1fr;
      align-items: center;
      gap: $size-2;
      padding: $size-2;
      height: 34px;
      th {
        text-align: right;
      }
      td {
        font-family: 'Rubik', monospace;
      }
    }
  }
  .form-action {
    display: flex;
  }
  .disabled {
    opacity: 0.5;
  }
}
</style>
