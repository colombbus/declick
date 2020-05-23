<template lang="pug">
.create-view
  create-header-bar
  create-menu-bar(
    @showView='showView'
    @toggleEditor='editor = !editor'
    :editor='editor'
  )
  transition(
    @before-enter='beforeEnter'
    @enter='onEnter'
    @leave='onLeave'
    :css='false'
  )
    .slider(v-if='view')
      .container
        .slider-header
          h3
            | Mes projets 
            chevron-right.breadcrumb-chevron
            | Nouveau projet
          declick-logo(class="declick-logo")
          button.close-button(@click='view = null')
        component(
          @showView='showView',
          @close='view = null',
          :is='view',
          :params='params'
          v-if='view'
        )
    ide(v-else)
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
import DeclickLogo from '@/assets/images/declick.svg?inline'
import ChevronRight from '@/assets/images/chevron.svg?inline'

export default {
  data() {
    return {
      view: null,
      params: null,
      editor: true,
      wikiUrl: config.wikiUrl,
      wiki: false,
    }
  },
  computed: {
    frameUrl() {
      return (
        `${config.clientUrl}index.html` +
        `#editor=${this.editor}` +
        `&token=${this.token}` +
        (this.currentProject ? `&id=${this.currentProject.id}` : '') +
        `&wiki=${this.wiki}`
      )
    },
    ...mapState(['currentProject', 'token']),
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
    DeclickLogo,
    ChevronRight,
    Ide,
    ProjectCreator,
    ProjectDetails,
    ProjectEditor,
    ProjectList,
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
    top: 112px;
    right: 0;
    bottom: 0;
    left: 0;
    padding: $size-3;
    background-color: #fff;
    overflow: auto;
    .slider-header {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      justify-content: space-between;
      align-items: center;
      .declick-logo {
        justify-self: center;
        width: 100px;
        .triangle-1,
        .triangle-2 {
          fill: $cab-sav;
        }
        .letter-d,
        .letter-k {
          fill: $crimson;
        }
        .letter-e,
        .letter-c1,
        .letter-l,
        .letter-i,
        .letter-c2 {
          fill: $white;
        }
        .robot-eyes {
          fill: $crimson;
        }
        .robot-head {
          fill: $robot-face;
        }
        .robot-body {
          fill: $crimson;
        }
      }
      .breadcrumb-chevron {
        vertical-align: middle;
        fill: $crimson;
        margin: 0 $size-1;
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
    }
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
  }
  .dropdown {
    position: absolute;
    z-index: 10;
  }
}
</style>
