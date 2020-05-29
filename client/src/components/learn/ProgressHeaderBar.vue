<template lang="pug">
#navigation-bar-small
  router-link#home-control-small(to="/")
  #page-title {{this.assessmentName}}
  router-link#map-control-small(:to="'/progress/course/' + $route.params.id")
  #mapController
    #leftLink(@click='previous()')
    #rightLink(@click='next()')
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

<style lang="scss">
@import '~@/assets/styles/globals';

#mapController div {
  cursor: pointer;
}
#rightLink:hover {
  // background-image: url(../../assets/images/controls/arrow-right-hover.svg);
}
#leftLink:hover {
  // background-image: url(../../assets/images/controls/arrow-left-hover.svg);
}
#rightLink {
  background-image: url(../../assets/images/controls/next-step.svg);
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
  background-image: url(../../assets/images/controls/next-step.svg);
  transform: scaleX(-1);
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
  background-color: $cab-sav;
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
  background-image: url(~@/assets/images/figures/declick-small.svg);
}

#map-control-small {
  box-sizing: content-box;
  display: inline-block;
  float: right;
  width: 42px;
  height: 42px;
  cursor: pointer;
  background-image: url(../../assets/images/controls/map.svg);
}

#map-control-small:hover {
  // background-image: url(../../assets/images/carte-hover.png);
}
</style>
