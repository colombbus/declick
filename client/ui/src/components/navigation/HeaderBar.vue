<template lang="pug">
.slogan-bar
  router-link.slogan-bar__logo(to='/' tag='button')
</template>

<style lang="sass">
.slogan-bar
  border-bottom: 3px solid #D1D718
  background: #480a2a

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
