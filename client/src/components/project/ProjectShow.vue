<template lang="pug">
.project-show.container
    h2 
      router-link.go-back(:to="`/users/${$route.params.id}/projects`") {{ $t('words.my-projects') }}
      span.fa.fa-angle-right.breadcrumb-separator
      span {{ project.name }}
    table
        tbody
            tr
              th {{ $t('words.id') }}
              td.tag {{ project.id }}
            tr
              th {{ $t('words.name') }}
              td {{ project.name }}
            tr
              th {{ $t('words.instructions') }}
              td {{ project.instructions }}
            tr
              th {{ $t('words.description') }}
              td {{ project.description }}
            tr
              th {{ $t('words.is-default') }}
              td {{ project.isDefault }}
            tr
              th {{ $t('words.is-public') }}
              td {{ project.isPublic }}
            tr
              th {{ $t('words.scene-width') }}
              td {{ project.sceneWidth }}
            tr
              th {{ $t('words.scene-height') }}
              td {{ project.sceneHeight }}
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      project: {},
    }
  },
  mounted() {
    if (this.$store.state.user) {
      this.getProjectByUserId()
    }
  },
  watch: {
    '$store.state.user': function(user) {
      this.getProjectByUserId()
    },
  },
  methods: {
    async getProjectByUserId() {
      const projectId = this.$route.params.pid
      this.project = await this.getProject({ id: projectId })
    },
    ...mapActions(['getProject']),
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.project-show {
  .go-back {
    color: $cab-sav;
  }

  .breadcrumb-separator {
    padding: 0 $size-3;
  }

  th,
  td {
    padding: $size-1;
  }
  th:nth-child(1) {
    text-align: right;
  }

  td:nth-child(2) {
    text-align: left;
  }
  span.fa.fa-star {
    color: $cab-sav;
  }
}
</style>
