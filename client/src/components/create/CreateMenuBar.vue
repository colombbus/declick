<template lang="pug">
.create-menu-bar
  .dropdown(v-show='user')
    a.dropdown-trigger(type='button' data-toggle='dropdown' @click="showPopup = !showPopup" v-click-outside="()=> {this.showPopup = false}")
    ul.dropdown-menu(v-show="showPopup")
      li.menu-item: a(@click="$emit('showView', { view: 'ProjectDetails', params: { project: currentProject }})") 
        i.fa.fa-info-circle
        | informations
      li.divider(role='separator')
      li.menu-item: a(@click="$emit('showView', 'ProjectList')")
        i.fa.fa-clipboard-list
        | projets
      template(v-if='user')
        li.divider(role='separator')
        li.menu-item: a(@click='importExamplePrograms')
          i.fa.fa-file-import
          | importer les programmes d'exemple
  span.project-name {{(currentProject && currentProject.name) || 'Projet'}}
  a(
    @click='toggleMode',
    :class="editor ? 'show-view-link' : 'show-editor-link'"
  )
</template>

<script>
import { mapState } from 'vuex'
import Api from '@/api'
import ClickOutside from 'vue-click-outside'

export default {
  props: ['editor'],
  data() {
    return {
      showPopup: false,
    }
  },
  methods: {
    importExamplePrograms() {
      Api.importProject(402, this.token)
      window.alert(
        'Les programmes ont été importés, veuillez recharger la page.',
      )
    },
    toggleMode() {
      this.$emit('toggleEditor')
    },
  },
  computed: mapState(['token', 'user', 'currentProject']),
  directives: {
    ClickOutside,
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.create-menu-bar {
  height: 50px;
  padding: 0 $size-1;
  // line-height: 50px;
  color: $cab-sav;
  border-bottom: 1px solid $border-color;
  a {
    cursor: pointer;
    text-decoration: none !important;
  }
  .dropdown {
    display: inline-block;
    &-menu {
      background-color: $white;
      padding: 0;
      border-color: $border-color;
      border-style: none solid solid;
      border-radius: 0 0 $size-2 $size-2;
      border-width: 1px;
      margin: 0;
      list-style: none;

      li:last-child a {
        border-radius: 0 0 $size-2 $size-2;
      }
      a {
        display: grid;
        grid-template-columns: 25px 1fr;
        align-items: center;
        // display: block;
        height: 24px;
        line-height: 24px;
        padding: $size-2 $size-3;
        .fa {
          font-size: 18px;
        }
        .fa-clipboard-list {
          margin-left: 2px;
        }
        .fa-file-import {
          margin-left: -2px;
        }

        &:hover {
          background-color: #f5f5f5;
        }
      }
      .divider {
        border-bottom: 1px solid $border-color;
      }
    }
  }

  .dropdown-trigger {
    display: inline-block;
    width: 21px;
    height: 50px;
    background-image: url(~@/assets/images/dropdown-trigger.svg);
    background-repeat: no-repeat;
    background-position: center;
    vertical-align: bottom;
    cursor: pointer;
    padding-left: $size-3;
  }
  .project-name {
    display: inline-block;
    font-family: 'Rubik', sans-serif;
    font-size: 20pt;
    font-weight: 700;
    color: $cab-sav;
    vertical-align: middle;
    height: 50px;
    line-height: 50px;
    position: absolute;
    left: 50px;
    z-index: 50;
  }
  .show-editor-link,
  .show-view-link {
    float: right;
    width: 36px;
    height: 36px;
    margin-top: 5px;
    cursor: pointer;
  }
  .show-editor-link {
    background-image: url(~@/assets/images/switch-editor.png);
  }
  .show-editor-link:hover {
    background-image: url(~@/assets/images/switch-editor-hover.png);
  }

  .show-view-link {
    background-image: url(~@/assets/images/view.svg);
  }

  .show-view-link:hover {
    background-image: url(~@/assets/images/switch-view-hover.png);
  }
}
</style>
