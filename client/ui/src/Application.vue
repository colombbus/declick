<template lang="pug">
.self(:style="{overflow: viewUseFullscreen ? 'hidden' : null}")
  HeaderBar.application__header(v-show='!viewUseFullscreen')
  MainMenu.header(v-show='!viewUseFullscreen')
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
  footer-bar(v-show='!viewUseFullscreen')
</template>

<script>
import R from 'ramda'
import courseRun from 'components/learn/CourseRun'
import CreateView from 'components/create/CreateView'
import FooterBar from 'components/navigation/FooterBar'
import HeaderBar from 'components/navigation/HeaderBar'
import MainMenu from 'components/navigation/MainMenu'

import Execute from 'components/execute/Execute'

export default {
  computed: {
    viewId () {
      if (this.$route.matched) {
        var last = R.last(this.$route.matched)
        if (last && last.meta && last.meta.id) {
          return last.meta.id
        }
      }
      return null
    },
    viewUseFullscreen () {
      return this.$route.matched.some(match => match.meta.useFullscreen)
    }
  },
  components: {
    courseRun,
    CreateView,
    FooterBar,
    HeaderBar,
    MainMenu,
    Execute
  }
}
</script>

<style lang="sass">

@font-face
	font-family: 'Rubik'
	src: url('assets/font/Rubik-Regular.eot')
	src: url('assets/font/Rubik-Regular.eot?#iefix') format('embedded-opentype')
  src: url('assets/font/Rubik-Regular.woff') format('woff')
	src: url('assets/font/Rubik-Regular.ttf') format('truetype')
	font-weight: normal
	font-style: normal

html, body
  height: 100%
  margin: 0
  padding: 0
</style>

<style lang="sass" scoped>
.self
  height: 100%
  margin: 0
  padding: 0

.header
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .25)

.content
  // header-bar:
  //   slogan-bar: 100px
  //   main-menu: 45px
  //   breadcrumb: 25px
  // footer-bar: 25px
  // total: 195px
  min-height: calc(100% - 195px)
  overflow: hidden
</style>
