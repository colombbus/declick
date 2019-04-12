<template lang="pug">
.main
  .loading(ref="loading")
    img(src="../../assets/img/spinner.gif")    
    p Chargement...
  execute-header-bar
  .main__execute(v-if="projectReady")
    iframe.execution(:src="iframeUrl", frameborder="0", scrolling="no", onmousewheel="", :style="iframeStyle")
</template>

<script>
import {mapState} from 'vuex'
import config from 'assets/config/declick'
import ExecuteHeaderBar from './ExecuteHeaderBar'
import store from '../../store'
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

let viewPortTag
let currentId = -1

export default {
  data () {
    return {
      count: 0,
      hidden: true
    }
  },
  created () {
    // console.log(this.$store)
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
      return config.clientUrl + 'execute.html#id=' + this.project.id + '&init=' + encodeURI(this.project.mainProgram) + "&count=" + this.count
    },
    ...mapState({project: 'executeProject'}),
    projectReady () {
      if (this.project !== null) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    if (this.project === null && this.$route.path.indexOf('execute') >= 0) {
      this.publicUserNeedIfram()
      this.startConfig()
    } else {
      this.startConfig()
    }
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
    startConfig () {
      viewPortTag = document.createElement('meta')
      viewPortTag.id = "viewport"
      viewPortTag.name = "viewport"
      viewPortTag.content = "width=device-width, user-scalable=no"
      document.getElementsByTagName('head')[0].appendChild(viewPortTag)
    },
    async publicUserNeedIfram () {
      let {body} = await Vue.http.get(`${config.apiUrl}v1/projects/${this.$route.path.split('/')[2]}`)
      // this.project = body
      return body
    },
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
