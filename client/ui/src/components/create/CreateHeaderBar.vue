<template lang="pug">
.self
  router-link.home-link(to='/')
  span.title Créer
  router-link.close-link(to='/')
</template>
<script>
// export default {
//       metaInfo: {
//     // Children can override the title.
//     title: 'Créé',
//     // Result: My Page Title ← My Site
//     // If a child changes the title to "My Other Page Title",
//     // it will become: My Other Page Title ← My Site
//     titleTemplate: '%s - Colombbus',
//     // Define meta tags here.
//     meta: [
//       {'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8'},
//       {name: 'viewport', content: 'width=device-width, initial-scale=1'},
//       {vmid: 'description', name: 'description', content: 'créé un jeux avec declick'},
//     ]
//   },
// }
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
  background-image: url(~assets/image/mini-logo.png)
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
  background-image: url(~assets/image/close.png)
  cursor: pointer

.close-link:hover
  background-image: url(~assets/image/close-hover.png)
</style>
