<template lang="pug">
.project-list
  //- button.btn.btn-default(@click="$emit('showView', 'ProjectCreator')")
  router-link.btn.btn-default(to="/create/new")
    i.fa.fa-plus
    | démarrer un nouveau projet
  .list-wrapper
    ul.list-group
      li.list-group-item(v-for='project in projects')
        router-link(:to="`/create/${project.id}/show`")
          h4.list-group-item-heading {{project.name}}
            span.project-edited(v-if="currentProject.id === project.id")
              i.fa.fa-hammer
              | en cours de travail
      //- a(
      //-   @click="$emit('showView', {view: 'ProjectDetails', params: {project}})"
      //- )
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      projects: [],
    }
  },
  async created() {
    this.projects = await this.getAllUserProjects()
  },
  computed: mapState(['currentProject']),
  methods: {
    ...mapActions(['getAllUserProjects']),
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.project-list {
  max-width: 1048px;
  margin-right: auto;
  margin-left: auto;
  height: 100%;
  position: relative;
  box-sizing: border-box;

  .fa-plus {
    margin-right: $size-1;
  }

  a {
    color: inherit;
    &:hover {
      color: inherit;
      text-decoration: none;
    }
  }

  .list-wrapper {
    position: fixed;
    width: 800px;
    top: 250px;
    bottom: 100px;
    overflow: auto;
  }

  ul.list-group {
    list-style: none;
    padding: 0 $size-3;
    box-sizing: border-box;

    .list-group-item {
      height: 44px;
      line-height: 44px;
      padding: 0 $size-3;
      border-bottom: 1px solid $border-color;
      border-right: 1px solid $border-color;
      border-left: 1px solid $border-color;
      h4 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        margin: 0;
        font-weight: normal;
      }
      &:nth-child(1) {
        border-top: 1px solid $border-color;
        border-radius: $size-2 $size-2 0 0;
      }
      &:last-child {
        border-radius: 0 0 $size-2 $size-2;
      }

      &:hover {
        // background-color: #f5f5f5;
        background-color: #aeacac1c;
        cursor: pointer;
      }
      .project-edited {
        .fa {
          margin-right: $size-2;
        }
        justify-self: end;
      }
    }
  }
}
</style>
