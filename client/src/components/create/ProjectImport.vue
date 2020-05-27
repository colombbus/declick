<template lang="pug">
.project-import
  ul.list-group
    li.list-group-item(v-for="project in projects")
      h4.list-group-item-heading
        | {{ project.comment}}
        span.difficulty
          i.fa.fa-star(v-for="d in project.difficulty" :class="`difficulty-${project.difficulty}`")
        i.fa.fa-file-import(@click="importExamplePrograms(project)" title="importer ce projet")
</template>

<script>
import { mapState } from 'vuex'
import Api from '@/api'

export default {
  data() {
    return {
      projects: [
        {
          id: 402,
          comment: 'Les bases - inspirées de Bob&Max',
          difficulty: 1,
        },

        { id: 5692, comment: 'Plateforme - niveau 1, 2, 3', difficulty: 2 },
        { id: 7327, comment: 'DinoRun', difficulty: 2 },

        { id: 6895, comment: 'Pong', difficulty: 3 },
        { id: 5833, comment: 'Runner - GothicVania ', difficulty: 3 },
      ],
    }
  },
  methods: {
    async importExamplePrograms() {
      await Api.importProject(402, this.token)
      window.alert(
        'Les programmes ont été importés, veuillez recharger la page.',
      )
    },
  },
  computed: mapState(['currentProject', 'token']),
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.project-import {
  max-width: 1048px;
  margin-right: auto;
  margin-left: auto;

  .difficulty {
    text-align: right;
  }
  .difficulty-1 {
    color: $cab-sav;
  }
  .difficulty-2 {
    color: $declick-yellow;
  }
  .difficulty-3 {
    color: $crimson;
  }
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
        grid-template-columns: 1fr 100px 50px;
        gap: $size-4;
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
      }
      i.fa.fa-file-import {
        justify-self: center;
        cursor: pointer;
        color: $cab-sav;
        font-size: 1.3em;
        padding: $size-2 $size-4;
      }
    }
  }
}
</style>
