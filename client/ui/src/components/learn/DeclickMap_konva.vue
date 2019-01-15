<template lang="html">
  <div id="map">
    <v-stage ref="stage" :config="configKonva">
      <v-layer ref="layer" >
        <v-path 
          ref="mapPath"
          :config="{
            draggable:true,
            data:mapConf.data,
            stroke:mapConf.color,
          }">
        </v-path>

      </v-layer>
    </v-stage>
  </div>
</template>

<script>
/* global __webpack_public_path__ */
import {mapState, mapActions} from 'vuex'


import mapConfig from './mapConfig'


const width = window.innerWidth;
const height = window.innerHeight;


export default {
  data () {
    return {
      dataTest:this.$store.state.currentCourse,
      mapConf:mapConfig,
      configKonva:{
        width,
        height
      },
      configCircle: {
        x: 100,
        y: 100, 
        radius: 70,
        fill: "red",
        stroke: "black",
        strokeWidth: 4
      }
    }
  },
  computed: {
    
  },
  mounted () {
    
    let mapPath = this.$refs.mapPath.getStage()
      console.log(this.dataTest);

    this.loadSteps()
  },
  methods: {
    
    async loadSteps () {

      await this.selectCourse({id: this.$route.params.id})

      
    },
    ...mapActions(['selectCourse', 'selectAssessment'])
  }
}
</script>

<style lang="css">
#declickMap {
    background-color:#000000;
    height: calc(100vh - 195px)
}
#map {
    width:100%;
    height:100%;
    background-color:#46102A;
    margin-right:auto;
    margin-left:auto;
}
#text {
    color:#FFFFFF;
}
</style>
