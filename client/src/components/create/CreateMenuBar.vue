<template lang="pug">
.create-menu-bar
  .dropdown(v-show='user')
    ul.dropdown-menu(v-show="showPopup")
      li.menu-item 
        router-link(:to="`/create/${project.id}/show`")
          i.fa.fa-info
          | informations
      li.divider(role='separator')
      li.menu-item 
        router-link(:to="`/create/projects`")
          i.fa.fa-list
          | projets
      //- a(@click="$emit('showView', 'ProjectList')")
      li.divider(role='separator')
      li.menu-item
        router-link(:to="`/create/${project.id}/import`")
          i.fa.fa-file-import
          | importer les programmes d'exemple
      //- template(v-if='user')
      //-   li.divider(role='separator')
      //-   li.menu-item: a(@click='importExamplePrograms')
  a.dropdown-trigger(type='button' data-toggle='dropdown' @click="showPopup = !showPopup" v-click-outside="()=> {this.showPopup = false}")
      span.project-name {{(project && project.name) || 'Projet'}}
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
    toggleMode() {
      this.$emit('toggleEditor')
    },
  },
  computed: {
    project() {
      let project = { id: 0, name: 'Mon projet' }
      if (this.currentProject) {
        project = this.currentProject
      }
      return project
    },
    ...mapState(['token', 'user', 'currentProject']),
  },
  directives: {
    ClickOutside,
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';
$menu-height: 50px;

.create-menu-bar {
  height: $menu-height;
  padding: 0 $size-2;
  color: $cab-sav;
  border-bottom: 1px solid $border-color;

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
      margin-top: $menu-height;

      li:last-child a {
        border-radius: 0 0 $size-2 $size-2;
      }
      a {
        display: grid;
        grid-template-columns: $size-4 1fr;
        align-items: center;
        // display: block;
        height: 24px;
        line-height: 24px;
        padding: $size-2 $size-3;
        color: $cab-sav;
        text-decoration: none;
        cursor: pointer;

        .fa-info {
          margin-left: 6px;
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
    height: $menu-height;
    background-image: url(~@/assets/images/controls/dropdown-trigger.svg);
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
    height: $menu-height;
    line-height: $menu-height;
    position: absolute;
    left: 55px;
    z-index: 50;
    text-overflow: 150px;
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
    background-image: url(~@/assets/images/controls/switch-editor.svg);
  }
  .show-editor-link:hover {
    // background-image: url(~@/assets/images/switch-editor-hover.png);
  }

  .show-view-link {
    background-image: url(~@/assets/images/controls/view.svg);
  }

  .show-view-link:hover {
    // background-image: url(~@/assets/images/switch-view-hover.png);
  }
}
</style>
