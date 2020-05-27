<template lang="pug">
.create-view
  create-header-bar
  create-menu-bar(
    @showView='showView'
    @toggleEditor='editor = !editor'
    :editor='editor'
  )
  ide

  slide-up-down.slider(:active="$route.meta.project")
    .container(v-if="$route.meta.project")
      .slider-header
        h3
          router-link(to="/create/projects") Mes projets
          chevron-right.breadcrumb-chevron
          | {{ $route.name }}
          chevron-right.breadcrumb-chevron(v-if='currentProject.name')
          span(v-if="currentProject.name") {{ currentProject.name }}
        //- button.close-button(@click='view = null')
        router-link.close-button(to="/create")
      .separator
      router-view
    //- component(
    //-   @showView='showView',
    //-   @close='view = null',
    //-   :is='view',
    //-   :params='params'
    //-   v-if='view'
    //- )
</template>

<script>
import { mapState } from 'vuex'

import CreateHeaderBar from './CreateHeaderBar'
import CreateMenuBar from './CreateMenuBar'
import Ide from './ide/Ide'
import ProjectCreator from './ProjectCreator'
import ProjectDetails from './ProjectDetails'
import ProjectEditor from './ProjectEditor'
import ProjectList from './ProjectList'
import config from '@/config'
import { EventBus } from '@/eventBus'
import SlideUpDown from '@/components/miscellaneous/SlideUpDown'

import ChevronRight from '@/assets/images/icons/chevron.svg?inline'

export default {
  data() {
    return {
      view: null,
      params: null,
      editor: true,
      wikiUrl: config.wikiUrl,
      wiki: false,
      projectName: '',
    }
  },
  // watch: {
  //   '$store.state.user'() {
  //     const currentProject = this.currentProject
  // if (typeof currentProject !== 'undefined' || currentProject !== null) {
  // return this.currentProject.name
  // } else {
  //   return ''
  // }
  // return ''
  //   },
  // },
  computed: {
    ...mapState(['currentProject']),
  },
  mounted() {
    window.addEventListener(
      'message',
      ({ data }) => {
        switch (data) {
          case 'switchEditor':
            this.editor = true
            break
          case 'switchView':
            this.editor = false
            break
          case 'toggleWiki':
            this.toggleWiki()
            break
        }
      },
      false,
    )
    const createFrame = this.$refs.createFrame
    EventBus.$on('initCreate', () => {
      createFrame.contentWindow.postMessage('init', '*')
    })
  },
  methods: {
    showView(payload) {
      if (typeof payload === 'string') {
        this.view = payload
      } else {
        this.view = payload.view
        this.params = payload.params
      }
    },
    beforeEnter(element) {
      // $(element).hide()
    },
    onEnter(element, done) {
      // $(element).slideDown(1000, done)
      done()
    },
    onLeave(element, done) {
      done()
      // $(element).slideUp(1000, done)
    },
    toggleWiki() {
      // Disabled in favor of new interface components.
      /*
      let wikiFrame = $(this.$refs.wikiFrame)
      let createFrame = $(this.$refs.createFrame)
      wikiFrame.stop()
      createFrame.stop()
      this.wiki = !(this.wiki)
      if (this.wiki) {
        wikiFrame.css('left', '-365px').show().animate({left: '0'}, 500)
        createFrame.animate({'padding-left': '365px'}, 500)
      } else {
        wikiFrame.animate({left: '-365px'}, 500, function () { $(this).hide() })
        createFrame.animate({'padding-left': '8px'}, 500, function () { $(this).css('padding-left', '') })
      }
      */
    },
  },
  components: {
    CreateHeaderBar,
    CreateMenuBar,
    ChevronRight,
    Ide,
    ProjectCreator,
    ProjectDetails,
    ProjectEditor,
    ProjectList,
    SlideUpDown,
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.create-view {
  position: relative;
  height: 100%;

  .slider {
    position: absolute;
    top: 100px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    background-color: $white;
    z-index: 5;

    .slider-header {
      display: grid;
      grid-template-columns: 1fr 50px;
      justify-content: space-between;
      align-items: center;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: no-repeat center url(~@/assets/images/declick.svg);
        opacity: 0.1;
        z-index: 0;
      }
      h3 {
        font-weight: normal;
        z-index: 1;
      }

      .breadcrumb-chevron {
        vertical-align: middle;
        fill: $crimson;
        margin: 0 $size-2;
      }
    }
    .container {
      padding: $size-3;
      position: relative;
      height: 95%;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: no-repeat url(~@/assets/images/declick.svg);
        background-position: -700px 450px;
        opacity: 0.07;
        z-index: -1;
        height: 100%;
        background-size: 200%;
      }
    }
    .close-button {
      justify-self: end;
      float: right;
      width: 26px;
      height: 26px;
      background-color: transparent;
      background-image: url(~@/assets/images/controls/close.svg);
      border: none;
      z-index: 1;
    }
  }
  .separator::after {
    content: '';
    display: block;
    width: 250px;
    margin-right: auto;
    margin-left: auto;
    margin-top: $size-3;
    margin-bottom: $size-3;
    border-bottom: 1px solid $crimson;
    grid-column: 1/4;
  }
  .frame {
    height: calc(100vh - 112px);
    width: 100%;
    padding: 0 8px 8px 8px;
    border: none;
    overflow: hidden;
  }

  .wikiFrame {
    position: absolute;
    height: calc(100vh - 112px);
    width: 365px;
    display: none;
    border: none;
  }
  .ide {
    height: calc(100% - 100px);
    z-index: 0;
  }
  .dropdown {
    position: absolute;
    z-index: 10;
  }
}
</style>
