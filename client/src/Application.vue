<template lang="pug">
.application(:class="fullscreenMode ? 'application--fullscreen': null")
  header-bar.application__header
  main-menu(v-show="!$route.meta.menuLess")
  .content
    course-run(v-show="this.$route.name === 'step'")
    create-view(v-show="this.$route.name === 'create'")
    execute(v-show="this.$route.name === 'execute'")
    keep-alive
      router-view(
        v-if='$route.meta.keepAlive === undefined || $route.meta.keepAlive',
        :key='viewId',
        :id='viewId'
      )
      router-view(
        v-if='$route.meta.keepAlive !== undefined && !$route.meta.keepAlive',
        :key='viewId',
        :id='viewId'
      )
  footer-bar.application__footer(v-show='!fullscreenMode')
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
        const last = this.$route.matched[this.$route.matched.length - 1]
        if (last && last.meta && last.meta.id) {
          return last.meta.id
        }
      }
      return null
    },
    fullscreenMode() {
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
.application {
  // display: grid;
  height: 100%;
  margin: 0;
  padding: 0;
  grid-template-rows: auto auto 1fr auto;
  .content {
    height: 100%;
  }
}
.application--fullscreen {
  .application__header,
  .application__footer {
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
