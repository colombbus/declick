<template lang="pug">
.project-details
  h3
    | Mes projets 
    i.fa.fa-angle-right.breadcrumb
    | {{ project.name }}
  .panel.panel-default
    table
      tr
        th nom du projet
        td {{ project.name }}
      tr
        th lien vers l'application
        td: router-link(:to="{name: 'execute', params: { projectId: project.id }}")
          | {{ project.name }}
      tr
        th public
        td {{ project.isPublic ? 'oui' : 'non' }}
      tr
        th largeur de la scène
        td {{ project.sceneWidth }}
      tr
        th hauteur de la scène
        td {{ project.sceneHeight }}
      tr
        th description
        td {{ project.description }}
      tr
        th instructions
        td {{ project.instructions }}
      tr
        th programme principal
        td {{ mainProgramName }}
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
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.project-details {
  max-width: 1048px;
  margin-left: auto;
  margin-right: auto;

  table {
    display: block;
    border: 1px solid $border-color;
    padding: $size-3;
    margin-bottom: $size-3;

    tr {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;

      padding: $size-2;
      height: 34px;
      th {
        text-align: right;
      }
    }
  }
}
</style>
