<template lang="pug">
div
  h3
    | Mes projets > {{project.name}}
  .panel.panel-default
    dl
      dt nom du projet
      dd {{project.name}}
      dt lien vers l'application
      dd: router-link(:to="{name: 'execute', params: {projectId: project.id}}")
        | {{project.name}}
      dt public
      dd {{project.isPublic ? 'oui' : 'non'}}
      dt largeur de la scène
      dd {{project.sceneWidth}}
      dt hauteur de la scène
      dd {{project.sceneHeight}}
      dt description
      dd {{project.description}}
      dt instructions
      dd {{project.instructions}}
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
  computed: {
    project() {
      return this.params.project
    },
    ...mapState(['currentProject', 'user']),
  },
  methods: {
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
    ...mapActions(['selectProject']),
  },
}
</script>

<style lang="scss" scoped>
.panel {
  padding-top: 20px;
}
dt {
  display: inline-block;
  padding: 5px;
  width: 25%;
  font-weight: bold;
  text-align: right;
}
dd {
  display: inline-block;
  width: 75%;
  padding: 5px;
}
</style>
