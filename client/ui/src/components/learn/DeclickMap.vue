<template lang="html">
  <div>
    <p class="mapHelp">
      <input type="button" value="centrer la carte" @click="centeringMap">
      <input type="button" value="remise a zero du parcours" @click="showRest = true;">
    </p>
    <div id="declickMap">
      <canvas id="map" ></canvas>
    </div>
    
    <div id="popinResetCircuits" v-if="showRest">
      <div>
        <p class="mapHelp alignCenter">
          Attention tu vas supprimer tout t'est resultat<br>
          <input type="button" value="oui" @click="resetCircuitResult">
          <input type="button" value="non" @click="showRest = false">
        </p>

      </div>
    </div>

  </div>
</template>

<script>
/* global __webpack_public_path__ */

import Map from '../../assets/js/map.js'
import {mapState, mapActions} from 'vuex'

import Api from '../../api'

import mapConfig from './mapConfig'

var map = new Map()

export default {
  data () {
    return {
      showRest: false
    }
  },
  computed: mapState([
    'currentAssessment',
    'currentCourse',
    'currentCourseResults',
    'user',
    'token'
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
      // map.setCurrentStep(this.currentCourse[1].id, false)
    })
  },
  activated () {
    if (this.currentAssessment) {
      map.setCurrentStep(this.currentAssessment.id, false)
    }
  },
  watch: {
    'currentAssessment.id' () {
      this.$router.push({
        name: 'step',
        params: {
          id: this.$route.params.id,
          assessmentId: this.currentAssessment.id
        }
      })
    },
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
    async resetCircuitResult () {
      // this.$forceUpdate()
      await Api.resetCircuitNodes(this.token, this.$route.params.id, this.user.id)
      this.showRest = false
      let robotPath = __webpack_public_path__ + // eslint-disable-line camelcase
      'static/map-robot.svg'
      map.init('map', robotPath, (step) => {
        console.log('step', step)
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
    centeringMap () {
      map.loadPathFromUI(mapConfig, () => {
        // Load steps
        this.loadSteps()
      })
    },
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
.alignCenter{
  text-align: center 
}
#popinResetCircuits{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(155,155,155,0.5);
  z-index: 999;
}
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
