<template lang="html">
  <div>
    <p class="mapHelp">appuis sur la barre d'espace si la carte disparais</p>
    <div id="declickMap">
      <canvas id="map" ></canvas>
    </div>
  </div>
</template>

<script>
/* global __webpack_public_path__ */

import Map from '../../assets/js/map.js'
import {mapState, mapActions} from 'vuex'

import mapConfig from './mapConfig'

var map = new Map()

export default {
  data () {
    return {
    }
  },
  computed: mapState([
    'currentAssessment',
    'currentCourse',
    'currentCourseResults',
    'user'
  ]),
  mounted () {
    // TODO: Find a better solution.
    let robotPath = __webpack_public_path__ + // eslint-disable-line camelcase
      'static/map-robot.svg'
    map.init('map', robotPath, (step) => {
      this.selectAssessment({id: step.id})
      this.$router.push({
        name: 'step',
        params: {
          id: this.$route.params.id,
          assessmentId: step.id
        }
      })
    }, () => {
      // Load path
      map.loadPathFromUI(mapConfig, () => {
        // Load steps
        this.loadSteps()
      })
    })
  },
  activated () {
    if (this.currentAssessment) {
      map.setCurrentStep(this.currentAssessment.id, false)
    }
  },
  watch: {
    currentCourseResults: {
      handler: function (value) {
        if (value) {
          map.setResults(value)
        }
      },
      deep: true,
      immediate: true
    },
    user () {
      this.loadSteps()
    },
    '$route.params.id' () {
      this.loadSteps()
    }
  },
  methods: {
    async loadSteps () {
      await this.selectCourse({id: this.$route.params.id})
      map.loadStepsFromUI(this.currentCourse)
      if (this.currentCourseResults) {
        map.setResults(this.currentCourseResults)
      }
    },
    ...mapActions(['selectCourse', 'selectAssessment'])
  }
}
</script>

<style lang="css">
#declickMap {
    background-color:#000000;
    height: calc(100vh - 210px)
}
#map {
    width:100%;
    height:100%;
    background-color:#46102A;
    margin-right:auto;
    margin-left:auto;
}
#text,.mapHelp {
    color:#FFFFFF;
}
.mapHelp{
  background-color: #46102A;
  padding: 5px 5px;
  margin: 0
}
</style>
