<template lang="pug">
.footer-bar
  | © Colombbus {{ ( new Date()).getUTCFullYear() }} -&nbsp;
  a(target='_blank' href='mailto:declick@colombbus.org') contact
</template>

<style lang="sass" scoped>
.footer-bar
  display: flex
  height: 25px
  padding: 0 5px
  align-items: center
  justify-content: center
  font-size: 12pt
  color: #fff
  background-color: #480A2A
  border-top: 1px solid #fff
  text-align: center

.footer-bar a
  color: #fff
  text-decoration: none
</style>
