<template lang="pug">
.self
  router-link.home-link(to='/')
  span.title {{(project && project.name)}}
  .close-link(@click="goBack")
</template>
<script>
import {mapState} from 'vuex'

let previousRoute

export default {
  methods: {
    goBack () {
      if (previousRoute) {
        this.$router.push(previousRoute)
      } else {
        this.$router.push("/")
      }
    }
  },
  computed: mapState({project: 'executeProject'}),
  watch: {
    $route (to, from) {
      if (to.name === 'execute') {
        if (from.name !== 'execute') {
          previousRoute = from.path
        }
      }
    }
  }
}

</script>
<style lang="sass" scoped>
.self
  padding: 5px 10px
  border-bottom: 5px solid #D1D718
  background-color: #480A2A

.home-link
  display: inline-block
  width: 45px
  height: 45px
  vertical-align: bottom
  background-image: url(~@/assets/image/mini-logo.png)
  cursor: pointer

.title
  display: inline-block
  margin-left: 25px
  font-family: "Rubik", sans-serif
  font-size: 25pt
  font-weight: 700
  color: white

.close-link
  display: inline-block
  float: right
  width: 42px
  height: 42px
  vertical-align: bottom
  background-image: url(~@/assets/image/close.png)
  cursor: pointer

.close-link:hover
  background-image: url(~@/assets/image/close-hover.png)
</style>
