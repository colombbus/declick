<template>
  <div>
    <progress-header-bar></progress-header-bar>
    <iframe
      :src="urlLearn"
      id="declick-client-learn"
      class="fullscreen-iframe2"
      ref="iframe"
    ></iframe>
    <!-- <div id="testDeclick"></div> -->
  </div>
</template>

<script>
import config from 'assets/config/declick'
import Channel from 'exports-loader?Channel!jschannel/src/jschannel.js'
import {mapState, mapActions} from 'vuex'
// import Api from 'src/api'
// import {EventBus} from 'src/eventBus'

import ProgressHeaderBar from '../learn/ProgressHeaderBar'

window.Channel = Channel
// import pem from 'exports-loader?TaskProxyManager&Platform!pem-platform/task-xd-pr.js'
// var task = false
export default {
  data () {
    return {
      storeReady: false,
      componentReady: false,
      initialized: false
    }
  },
  methods: {
    init () {
      if (this.initialized || !this.storeReady || !this.componentReady) {
        return
      }

      this.initialized = true

      if (this.$route.name === 'step') {
        // set step visited
        // créé une method alternative seulement pour les visites
        this.selectAssessment({id: parseInt(this.$route.params.assessmentId)})
      }

      window.addEventListener('message', event => {
        this.selectNextAssessment()
      }, false)

      // var self = this
      // pem.Platform.prototype.showView = function (views, success, error) {
      //   let [currentAssessmentResult] = self.currentCourseResults.filter(
      //     result => result.assessmentId === self.currentAssessment.id
      //   )
      //   if (currentAssessmentResult && currentAssessmentResult.solution) {
      //     task.reloadAnswer(currentAssessmentResult.solution, () => {
      //       success()
      //     })
      //   } else {
      //     success()
      //   }
      // }

      // pem.Platform.prototype.openUrl = function (url, success, error) {
      //   if (url.name && url.name === 'import' && url.id) {
      //     // special case to import a project
      //     Api.importProject(url.id, self.token).then(() => {
      //       EventBus.$emit('initCreate')
      //       success()
      //     }, error)
      //   } else {
      //     self.$router.push(url, success, error)
      //   }
      // }

      // pem.Platform.prototype.validate = function (mode, success, error) {
      //   if (mode === 'nextOnly') {
      //     self.selectNextAssessment()
      //   } else {
      //     task.getAnswer(async answer => {
      //       await self.registerCurrentAssessmentResult({
      //         passed: true,
      //         solution: answer
      //       })
      //       if (mode === 'nextImmediate') {
      //         // wait for all watchers to be triggered
      //         self.$nextTick(() => {
      //           self.selectNextAssessment()
      //         })
      //       }
      //     })
      //   }
      //   success()
      // }

      // var iframe = document.getElementById('declick-client-learn')
      // var initProxy = function () {
      //   pem.TaskProxyManager.getTaskProxy('declick-client-learn', ref => {
      //     task = ref
      //     pem.TaskProxyManager.setPlatform(task, new pem.Platform(task))
      //   })
      //   iframe.removeEventListener('load', initProxy)
      // }
    },
    ...mapActions([
      'currentAssessment',
      'selectCourse',
      'selectAssessment',
      'selectNextAssessment',
      'registerCurrentAssessmentResult'
    ])
  },
  computed: {
    urlLearn () {
      // this.testSomeShit()
      // let id = this.$store.getters.getUser.id
      let lastParams = ""
      if (this.$route.path.split("/")[4] === "run") {
        if (this.currentCourse !== null) {
          for (let index = 0; index < this.currentCourse.length; index++) {
            let currentItem = this.currentCourse[index]
            if (currentItem.id === this.currentAssessment.id) {
              lastParams = "&project-id=" + this.currentAssessment.id
            }
          }
        }
      }
      if (this.currentAssessment) {
        if (this.currentAssessment.url) {
          // return this.currentAssessment.url + '&token=' + this.token + '&channelId=declick'
          // return this.currentAssessment.url + '&token=' + this.token + '&channelId=declick'
          let regx = /[a-z]*\.html#[a-z]*=(\d{1,})$/g
          let urlMatch = this.currentAssessment.url.match(regx)
          return config.clientUrl + urlMatch + '&token=' + this.token + lastParams
          // return de base
          // console.log(this.currentAssessment.url)
          // return this.currentAssessment.url + '&token=' + this.token
        } else {
          // chapter
          this.$router.push({name: 'map', params: {id: this.$route.params.id}})
          // return config.clientUrl + 'learn.html#token=' + this.token + '&channelId=declick'
          return config.clientUrl + 'learn.html#token=' + this.token + lastParams
        }
      } else {
        // return config.clientUrl + 'learn.html#token=' + this.token + '&channelId=declick'
        return config.clientUrl + 'learn.html#token=' + this.token + lastParams
      }
    },
    ...mapState(['currentAssessment', 'currentCourse', 'currentCourseResults', 'token'])
  },
  mounted () {
    // let declick = document.createElement('script')
    // declick.setAttribute('src', config.clientUrl + 'learn.html')
    // document.head.appendChild(declick)
    // console.log(declick)
    this.componentReady = true
    this.init()
  },
  watch: {
    currentCourseResults: {
      handler: function (value) {
        if (value) {
          this.storeReady = true
          this.init()
        }
      },
      immediate: true
    }
  },
  components: {
    ProgressHeaderBar
  }
}

</script>
<style lang="css">
.fullscreen-iframe2 {
  height: calc(100vh - 60px);
  width: 100%;
  border: none;
  overflow:hidden;
}
</style>