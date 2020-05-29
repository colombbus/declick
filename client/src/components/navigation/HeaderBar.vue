<template lang="pug">
.slogan-bar
  router-link.slogan-bar__logo(to='/' tag='button')
</template>

<style lang="scss">
@import '~@/assets/styles/globals';

.slogan-bar {
  border-bottom: 3px solid $declick-yellow;
  background: $cab-sav;
}

.slogan-bar__logo {
  display: block;
  height: 90px;
  width: 157px;
  margin: 0 auto;
  padding: 0;
  border: 0;
  background-color: transparent;
  background-image: url(~@/assets/images/figures/declick.svg);
  outline: 0;
}
</style>
