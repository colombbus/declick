<template lang="pug">
.self
  router-link(:to="'/users/' + user.id") {{user.username}}
  router-link(
    to='/administration'
    v-if='user.isAdmin'
  )
    span.glyphicon.glyphicon-wrench
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: mapState(['user'])
}
</script>

<style lang="sass" scoped>
a
  padding: 0
  font-family: Rubik, sans-serif
  font-size: 18.6667px
  color: white
  outline: 0
  cursor: pointer

.self
  height: 38px
  // width: 150px ( 'mathieuLauffenburger' ca déborde)
  text-align: center
  line-height: 35px
  background-color: #642D46
  padding: 0 5px

.glyphicon
  position: relative
  top: 3px
  margin: 0 5px
</style>
