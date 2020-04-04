<template lang="pug">
div
  h3
    | Mes projets
  ul.list-group
    li.list-group-item(v-for='project in projects')
      a(
        @click="$emit('showView', {view: 'ProjectDetails', params: {project}})"
      )
        h4.list-group-item-heading {{project.name}}
  button.btn.btn-default(@click="$emit('showView', 'ProjectCreator')")
    | démarrer un nouveau projet
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      projects: [],
    }
  },
  async created() {
    this.projects = await this.getAllUserProjects()
  },
  methods: mapActions(['getAllUserProjects']),
}
</script>

<style lang="scss" scoped>
a {
  color: inherit;
}
a:hover {
  color: inherit;
  text-decoration: none;
}
.list-group-item:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}
</style>
