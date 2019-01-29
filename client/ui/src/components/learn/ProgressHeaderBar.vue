<template>
  <div id="navigation-bar-small">
    <router-link to="/" id="home-control-small"></router-link>
    <div id="page-title">{{this.assessmentName}}</div>
    <router-link :to="'/progress/course/'+this.$route.params.id" id="map-control-small"></router-link>
    <div id="mapController">
      <div id="leftLink" @click="previous()"></div>
      <div id="rightLink" @click="next()"></div>
    </div>
  </div>
</template>

<script>
/* global $ */

import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    assessmentName() {
      if (this.currentAssessment) {
        return this.currentAssessment.name
      } else {
        return ''
      }
    },
    ...mapState(['currentAssessment']),
  },
  methods: {
    previous() {
      this.selectPreviousAssessment()
    },
    next() {
      this.selectNextAssessment()
    },
    toggleMapIframe() {
      $('#declick-client-learn').css('display', 'none')
      $('#map').css('display', 'block')
    },
    ...mapActions(['selectPreviousAssessment', 'selectNextAssessment']),
  },
}
</script>

<style>
#mapController div {
  cursor: pointer;
}
#rightLink:hover {
  background-image: url('../../assets/images/arrow-right-hover.png');
}
#leftLink:hover {
  background-image: url('../../assets/images/arrow-left-hover.png');
}
#rightLink {
  background-image: url('../../assets/images/arrow-right.png');
  content: '';
  position: absolute;
  right: 115px !important;
  top: 9px;
  background-color: transparent;
  height: 33px;
  width: 33px;
}
#leftLink {
  position: absolute;
  content: '';
  background-image: url('../../assets/images/arrow-left.png');
  right: 165px;
  top: 9px;
  left: initial !important;
  background-color: transparent;
  transform: initial;
  -webkit-transform: initial;
  height: 33px;
  width: 33px;
}
#navigation-bar-small {
  padding: 0px 10px;
  background-color: #480a2a;
  border-bottom: 5px solid #d1d718;
  height: 55px;
}

#page-title {
  margin-left: 25px;
  font-weight: 700;
  font-size: 25pt;
  color: white;
  font-family: 'Rubik', sans-serif;
  float: left;
  display: inline-block;
}

#home-control-small {
  display: inline-block;
  float: left;
  width: 45px;
  height: 45px;
  cursor: pointer;
  background-image: url('../../assets/images/dk.png');
}

#map-control-small {
  box-sizing: content-box;
  display: inline-block;
  float: right;
  width: 42px;
  height: 42px;
  cursor: pointer;
  background-image: url('../../assets/images/carte.png');
}

#map-control-small:hover {
  background-image: url('../../assets/images/carte-hover.png');
}
</style>
