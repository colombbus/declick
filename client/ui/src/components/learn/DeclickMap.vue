<template lang="html">
  <div>
    <p class="mapHelp">
      <input type="button" value="Centrer la carte" @click="centeringMap">
      <input type="button" value="Réinitialiser le parcours " @click="showRest = true;" v-if="user !== null && token !== null">
    </p>
    <div id="declickMap">
      <canvas id="map" ></canvas>
    </div>
    
    <div id="popinResetCircuits" v-if="showRest">
      <div>
        <p class="mapHelp alignCenter">
          Attention ! Cette action supprimera l'ensemble des réponses du parcours<br>
          <input type="button" id="validation" value="Confirmer" @click="resetCircuitResult">
          <input type="button" id="annullation" value="Annuler" @click="showRest = false">
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
  updated () {
    console.log("updated")
  },
  activated () {
    console.log("actived")
    if (this.currentAssessment) {
      map.setCurrentStep(this.currentAssessment.id, false)
    }
  },
  watch: {
    '$route' () {
      map.loadPathFromUI(mapConfig, () => {
        // Load steps
        this.loadSteps()
      })
    },
    'currentAssessment.id' () {
      this.$router.push({
        name: 'step',
        params: {
          id: this.$route.params.id,
          assessmentId: this.currentAssessment.id
        }
      })
      this.$store.dispatch("loadCurrentCourseResults").then(() => {
        setTimeout(() => {
          map.loadPathFromUI(mapConfig, () => {
            // Load steps
            this.loadSteps()
          })
        }, 100)
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
      map.loadPathFromUI(mapConfig, () => {
        // Load steps
        this.loadSteps()
      })
    }
  },
  methods: {
    async resetCircuitResult () {
      // this.$forceUpdate()
      await Api.resetCircuitNodes(this.token, this.$route.params.id, this.user.id).then((r) => {
        this.showRest = false
        this.$store.dispatch("loadCurrentCourseResults")
        setTimeout(() => {
            // Load path
          map.loadPathFromUI(mapConfig, () => {
            // Load steps
            this.loadSteps()
          })
        }, 250)
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
#popinResetCircuits #validation:hover{
  color: green
}
#popinResetCircuits #annullation:hover{
  color: red
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
.mapHelp input{
  background: #31383A;
  border-radius: 5px;
  border:none;
  padding: 5px 10px;
  color: white
}
.mapHelp input:hover{
  background: #2B2F31;
}
.mapHelp{
  background-color: #46102A;
  padding: 5px 5px;
  margin: 0
}
</style>
