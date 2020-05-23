<template lang="pug">
.project-list
  h3
    | Mes projets
  button.btn.btn-default(@click="$emit('showView', 'ProjectCreator')")
    i.fa.fa-plus
    | démarrer un nouveau projet
  ul.list-group
    li.list-group-item(v-for='project in projects')
      a(
        @click="$emit('showView', {view: 'ProjectDetails', params: {project}})"
      )
        h4.list-group-item-heading {{project.name}}
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

<style lang="scss">
@import '~@/assets/styles/globals';

.project-list {
  max-width: 1048px;
  margin-right: auto;
  margin-left: auto;
  a {
    color: inherit;
  }
  a:hover {
    color: inherit;
    text-decoration: none;
  }
  ul.list-group {
    overflow-y: auto;
    max-height: 50vh;
    list-style: none;
    padding: $size-3;
    .list-group-item {
      &:nth-child(1) {
        border-top: 1px solid $border-color;
        border-radius: $size-2 $size-2 0 0;
      }
      &:last-child {
        border-radius: 0 0 $size-2 $size-2;
      }
      height: 44px;
      line-height: 44px;
      padding-left: $size-2;
      border-bottom: 1px solid $border-color;
      border-right: 1px solid $border-color;
      border-left: 1px solid $border-color;

      &:hover {
        background-color: #f5f5f5;
        cursor: pointer;
      }
      h4 {
        margin: 0;
      }
    }
  }
}
</style>
