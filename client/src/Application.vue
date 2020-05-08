<template lang="pug">
.application(:class="fullscreenMode ? 'application--fullscreen': null")
  header-bar.application__header
  main-menu
  //- .content
  //-   course-run(v-show="this.$route.name === 'step'")
  //-   create-view(v-show="this.$route.name === 'create'")
  //-   execute(v-show="this.$route.name === 'execute'")
  //-   keep-alive
    //-   router-view(
    //-     v-if='$route.meta.keepAlive === undefined || $route.meta.keepAlive',
    //-     :key='viewId',
    //-     :id='viewId'
    //-   )
    //- router-view(
    //-   v-if='$route.meta.keepAlive !== undefined && !$route.meta.keepAlive',
    //-   :key='viewId',
    //-   :id='viewId'
    //- )
  router-view
  footer-bar.application__footer(v-show='!viewUseFullscreen')
</template>

<script>
import CourseRun from '@/components/learn/CourseRun'
import CreateView from '@/components/create/CreateView'
import FooterBar from '@/components/navigation/FooterBar'
import MainMenu from '@/components/navigation/MainMenu'
import HeaderBar from '@/components/navigation/HeaderBar'
import Execute from '@/components/execute/Execute'

export default {
  computed: {
    viewId() {
      if (this.$route.matched) {
        /*eslint-disable no-undef */
        var last = R.last(this.$route.matched)
        if (last && last.meta && last.meta.id) {
          return last.meta.id
        }
      }
      return null
    },
    fullscreenMode() {
      return this.$route.matched.some(match => match.meta.useFullscreen)
    },
    viewUseFullscreen() {
      return this.$route.matched.some(match => match.meta.useFullscreen)
    },
  },
  components: {
    CourseRun,
    CreateView,
    FooterBar,
    HeaderBar,
    MainMenu,
    Execute,
  },
}
</script>

<style lang="scss">
:root {
  --main-dark-color: #480a2a;
    --main-light-color: #e22c20;
    --main-line-color: #c8ce17;
    --main-dark-variant-color: #6e3a51;
    --main-light-variant-color: #f4b39b;
}

.application {
  display: grid;
  height: 100%;
  margin: 0;
  padding: 0;
  grid-template-rows: auto auto 1fr auto;
}
.application--fullscreen {
  &__header-bar,
  &__footer-bar {
    display: none;
  }
}

// small devices

@media only screen and (max-width: 576px) {
  .application__header,
  .application__footer {
    display: none;
  }
}
</style>
