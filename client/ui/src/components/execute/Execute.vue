<template lang="pug">
.main
  .loading(ref="loading")
    img(src="../../assets/img/spinner.gif")    
    p Chargement...
  execute-header-bar
  .main__execute
    iframe.execution(:src="iframeUrl", frameborder="0", scrolling="no", onmousewheel="", :style="iframeStyle")
</template>

<script>
import {mapState} from 'vuex'
import config from 'assets/config/declick'
import ExecuteHeaderBar from './ExecuteHeaderBar'
import store from '../../store'

let viewPortTag
let currentId = -1

export default {
  data () {
    return {
      count: 0,
      hidden: true
    }
  },
  computed: {
    iframeStyle () {
      let content = "width:"
      if (this.project && this.project.sceneWidth) {
        content += this.project.sceneWidth + "px;"
      } else {
        content += "100%;"
      }
      content += "height:"
      if (this.project && this.project.sceneHeight) {
        content += this.project.sceneHeight + "px;"
      } else {
        content += "100%;"
      }
      return content
    },
    iframeUrl () {
      if (!this.hidden && this.project && this.project.mainProgram) {
        return config.clientUrl + 'execute.html#id=' + this.project.id + '&init=' + encodeURI(this.project.mainProgram) + "&count=" + this.count
      } else {
        return config.clientUrl + 'execute.html#'
      }
    },
    ...mapState({project: 'executeProject'})
  },
  mounted () {
    viewPortTag = document.createElement('meta')
    viewPortTag.id = "viewport"
    viewPortTag.name = "viewport"
    viewPortTag.content = "width=device-width, user-scalable=no"
    document.getElementsByTagName('head')[0].appendChild(viewPortTag)
    if (this.$route.name === 'execute') {
      this.checkId()
    }
  },
  watch: {
    project () {
      if (this.project.sceneWidth) {
        viewPortTag.content = "width=" + this.project.sceneWidth + ", user-scalable=no"
      } else {
        viewPortTag.content = "width=device-width, user-scalable=no"
      }
    },
    $route (to, from) {
      if (to.name === 'execute') {
        this.hidden = false
        this.checkId()
      } else if (!this.hidden) {
        this.hidden = true
      }
    }
  },
  components: {
    ExecuteHeaderBar
  },
  methods: {
    async checkId () {
      if (this.$route.params.projectId) {
        let newId = parseInt(this.$route.params.projectId)
        if (newId !== currentId) {
          this.$refs.loading.style.display = "flex"
          await store.dispatch('loadExecuteProject', {id: newId})
          this.$refs.loading.style.display = "none"
          currentId = newId
          this.count = 0
        } else {
          this.count++
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.main 
  height: 100vh
  background-color: #000000
  position: relative

.main__execute
  height: calc(100vh - 63px)

.execution
  display: block
  margin-left: auto
  margin-right: auto
  padding: 0

.loading
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  background-color: #FFFFFF

.loading img
  height: 50px

.loading p
  font-weight: bolder

</style>
