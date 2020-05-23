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
        td: router-link(:to="{name: 'execute', params: { projectId: project.id }}")
          | {{ project.name }}
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
  button.btn.btn-default(
    @click="$emit('showView', {view: 'ProjectEditor', params: {project}})"
    type='button'
  ) modifier les informations
  |
  |
  button.btn.btn-default(
    @click="selectAsCurrentProject"
    type='button'
  ) travailler sur ce projet
  |
  |
  button.btn.btn-danger(
    v-show='!project.isDefault'
    @click="deleteProject"
    type='button'
  ) supprimer
</template>

<script>
import { mapActions, mapState } from 'vuex'
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
      mainProgramName: null,
    }
  },
  mounted() {
    this.getMainProgramName(this.params.project.mainProgramId)
  },
  computed: {
    project() {
      return this.params.project
    },
    ...mapState(['currentProject', 'user']),
  },
  methods: {
    async getMainProgramName(id) {
      const resources = await this.getAllProjectResources()
      const [{ file_name }] = resources.filter(r => r.id === id)
      this.mainProgramName = file_name
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
      this.$emit('showView', { view: 'ProjectList' })
    },
    ...mapActions(['selectProject', 'getAllProjectResources']),
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
    padding: $size-3;
    margin-bottom: $size-3;

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
    }
  }
}
</style>
