<template lang="pug">
.slogan-bar(v-if="testRoute()")
  router-link.slogan-bar__logo(to='/' tag='button')
</template>

<script>
export default {
  methods: {
    testRoute () {
      if (this.$route.name === 'create' || this.$route.path.indexOf('execute') >= 0 || this.$route.path.indexOf('draw') >= 0 || this.$route.path.indexOf('run') >= 0) return 0
      else return 1
    }
  }
}
</script>

<style lang="sass">
.slogan-bar
  border-bottom: 3px solid #D1D718
  background: #480a2a
  padding: 5px 0

.slogan-bar__logo
  display: block
  height: 90px
  width: 157px
  margin: 5px auto
  padding: 0
  border: 0
  background-color: transparent
  background-image: url(../../assets/images/logos/Declick.svg)
  background-repeat: no-repeat
  outline: 0

@media only screen and (max-width: 576px)
  .slogan-bar
    border: 0
    background-color: transparent
  .slogan-bar__logo
    height: 60px
    width: 60px
    background-image: url(../../assets/images/logos/Declick-small.svg)
</style>
