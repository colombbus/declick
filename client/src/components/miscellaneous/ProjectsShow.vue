<template lang="pug">
.projects-show.container
    h2 {{ $t('words.my-projects') }}
    router-link.btn.btn-default(:to="`/users/${userId}/projects/new`")
      i.fa.fa-plus
      | {{ $t('words.new-project') }}
    table
        thead
            tr
                th {{ $t('words.id') }}
                th {{ $t('words.name') }}
                th {{ $t('words.is-default') }}
                th {{ $t('words.is-public') }}
                th {{ $t('words.edit') }}
                th {{ $t('words.show') }}
                th {{ $t('words.delete') }}
                th {{ $t('words.work-on-this-project') }}
        tbody
            tr(v-for="(project, index) in projects" :key="index" :class="confirmDelete !== null ? (confirmDelete === index ? '' : 'disabled') : ''")
                td 
                    router-link.tag(:to="`/users/${userId}/projects/${project.id}`") {{ project.id }}
                td {{ project.name }}
                td 
                   span(:class="project.isDefault ? 'fa fa-star' : 'fa fa-star fa-isnt-enabled'")
                td
                   span(:class="project.isPublic ? 'fas fa-globe-africa' : 'fas fa-globe-africa fa-isnt-enabled'")
                td
                   router-link.fa.fa-pen(:to="`/users/${userId}/projects/${project.id}/edit`")
                td
                   router-link.fa.fa-eye(:to="`/users/${userId}/projects/${project.id}`")
                td.delete-action
                   span.fa.fa-trash(v-show="confirmDelete !== index" @click="confirmDelete = index")
                   span.delete-timer(v-show="confirmDelete === index && deleteTimer") 
                    | {{ deleteTimer }}
                   span.fa.fa-check(v-show="confirmDelete === index && !deleteTimer" @click="deleteThisProject(project.id)")
                   span.fa.fa-times(v-show="confirmDelete === index" @click="cancelDelete()")
                td
                   span.far.fa-check-circle(
                     :class="project.id === currentProjectId ? 'selected' : ''" 
                     @click="selectProject({ id: project.id});currentProjectId=project.id"
                    )
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      projects: [],
      userId: null,
      confirmDelete: null,
      currentProjectId: null,
      deleteTimer: null,
      intervalAnimation: null,
      endTimeout: null,
    }
  },
  mounted() {
    if (this.$store.state.user) {
      this.getProjectsByUserId()
      this.currentProjectId = this.$store.state.user.currentProjectId
    }
  },
  watch: {
    '$store.state.user': function(user) {
      this.getProjectsByUserId()
      this.currentProjectId = user.currentProjectId
    },
  },
  methods: {
    stopDeleteAnimation() {
      this.deleteTimer = null
      clearInterval(this.intervalAnimation)
      clearTimeout(this.endTimeout)
    },
    startDeleteAnimation(callback) {
      this.deleteTimer = 4
      this.intervalAnimation = setInterval(() => {
        this.deleteTimer--
      }, 1000)
      this.endTimeout = setTimeout(() => {
        callback()
        this.currentProjectId = this.$store.state.user.currentProjectId
        this.cancelDelete()
        // TODO : what's happen -> all deleted ? / current selected deleted ?
      }, this.deleteTimer * 1000)
    },
    cancelDelete() {
      this.stopDeleteAnimation()
      this.confirmDelete = null
    },
    async getProjectsByUserId() {
      this.userId = this.$route.params.id
      this.projects = await this.getAllUserProjects()
    },
    async deleteThisProject(id) {
      this.startDeleteAnimation(async () => {
        await this.deleteProject({ id })
        this.projects = await this.getAllUserProjects()
      })
    },
    ...mapActions(['getAllUserProjects', 'deleteProject', 'selectProject']),
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.projects-show {
  h2 {
    display: inline-block;
    margin-right: $size-3;
  }

  i.fa.fa-plus {
    padding: $size-1;
  }

  .tag {
    display: block;
  }

  table {
    border-collapse: collapse;
  }

  th,
  td {
    padding: $size-2;
  }

  tr:hover {
    background-color: #150f0f0a;
  }

  td:first-child {
    text-align: right;
  }

  td:nth-child(3),
  td:nth-child(4),
  td:nth-child(5),
  td:nth-child(6),
  td:nth-child(7),
  td:nth-child(8) {
    text-align: center;
  }

  td:nth-child(7):hover .fa-trash {
    color: $delete-color;
  }
  tr.disabled td:nth-child(7):hover .fa-trash {
    color: $cab-sav;
  }
  tr.disabled {
    opacity: 0.3;
  }

  .far.fa-check-circle,
  .fa-trash,
  .fa.fa-eye,
  .fa.fa-pen,
  .fa-globe-africa,
  span.far.fa-star,
  span.fa.fa-star {
    color: $cab-sav;
  }

  .far.fa-check-circle,
  .fa-trash,
  .fa.fa-eye,
  .fa.fa-pen {
    text-decoration: none;
  }

  td:nth-child(8) .far.fa-check-circle {
    opacity: 0.3;
  }
  td:nth-child(8) .far.fa-check-circle.selected {
    opacity: 1;
    font-weight: bold;
  }

  .fa-isnt-enabled {
    opacity: 0.2;
  }
  .delete-action {
    height: 36px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .fa.fa-check:hover {
    background-color: $delete-color;
    color: $white;
  }
  .fa.fa-check,
  .fa.fa-times {
    padding: $size-1;
    width: $size-3;
    border: 1px solid $cab-sav;
    border-radius: $size-1;
  }
}
</style>
