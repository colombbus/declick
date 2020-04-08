<template lang="html">
  <div id="declickMap">
      <canvas id="map"></canvas>
      <!-- <courseRunfrom></courseRunfrom> -->
        <keep-alive>
    <router-view></router-view>
  </keep-alive>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
/* global __webpack_public_path__ */

import Map from './map.js'
import { mapState, mapActions } from 'vuex'

import courseRunfrom from '@/components/learn/CourseRun'

import mapConfig from './mapConfig'

var map = new Map()

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    courseRunfrom,
  },
  data() {
    return {}
  },
  computed: mapState([
    'currentAssessment',
    'currentCourse',
    'currentCourseResults',
    'user',
  ]),
  mounted() {
    // TODO: Find a better solution.
    let robotPath = require('@/assets/images/robot-pawn.svg')
    map.init(
      'map',
      robotPath,
      step => {
        this.selectAssessment({ id: step.id })
        this.$router.push({
          name: 'step',
          params: {
            id: this.$route.params.id,
            assessmentId: step.id,
          },
        })
      },
      () => {
        // Load path
        map.loadPathFromUI(mapConfig, () => {
          // Load steps
          this.loadSteps()
        })
      },
    )
  },
  activated() {
    if (this.currentAssessment) {
      map.setCurrentStep(this.currentAssessment.id, false)
    }
  },
  watch: {
    currentCourseResults: {
      handler: function(value) {
        if (value) {
          map.setResults(value)
        }
      },
      deep: true,
      immediate: true,
    },
    user() {
      this.loadSteps()
    },
    '$route.params.id'() {
      console.log('currentCours :')
      this.loadSteps()
    },
  },
  methods: {
    async loadSteps() {
      await this.selectCourse({ id: this.$route.params.id })
      map.loadStepsFromUI(this.currentCourse)
      if (this.currentCourseResults) {
        map.setResults(this.currentCourseResults)
      }
    },
    ...mapActions(['selectCourse', 'selectAssessment']),
  },
}
</script>

<style scoped>
.application {
  background-color: #46102a;
}
#declickMap {
  background-color: #46102a;
  height: calc(100vh - 170px);
}
#map {
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: #46102a;
  margin-right: auto;
  margin-left: auto;
}
#text {
  color: #ffffff;
}
</style>
