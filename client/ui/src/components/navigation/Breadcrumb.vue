<template lang="pug">
ul
  li(v-for='(route, index) in matchedRoutes')
    router-link(
      v-if='index !== matchedRoutes.length - 1',
      :to='route.path',
      :class="'level-' + (index + 1)"
    ) {{route.meta.title}}
    span(
      v-else
      :class="['level-' + (index + 1), 'current']"
    ) {{route.meta.title}}
</template>

<script>
export default {
  computed: {
    matchedRoutes () {
      let routes = this.$route.matched.filter(route => route.meta.title)
      if (routes[0] && routes[0].name !== 'home') {
        routes.unshift({
          path: '/',
          meta: {
            title: 'Accueil'
          }
        })
      }
      return routes
    }
  }
}
</script>

<style lang="sass" scoped>
ul
  height: 25px
  margin-bottom: 0
  padding-left: 0px
  background-color: #480A2A

li
  display: inline-block
  height: 25px
  margin-left: 0px
  margin-right: 5px
  list-style-type: none

a, span
  display: inline-block
  padding: 0 5px
  border-left: 5px solid #E42C20
  line-height: 25px
  font-size: 12pt
  font-weight: bold
  color: white

.level-1
  border-color: #0FAC8E

.level-2
  border-color: #E11782

.current
  color: #D1D718
</style>
