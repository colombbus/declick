<template lang="pug">
.slogan-bar
  router-link.slogan-bar__logo(to='/' tag='button')
</template>

<style lang="scss">
.slogan-bar {
  border-bottom: 3px solid #d1d718;
  background: #480a2a;
}

.slogan-bar__logo {
  display: block;
  height: 90px;
  width: 157px;
  margin: 5px auto;
  padding: 0;
  border: 0;
  background-color: transparent;
  background-image: url(~@/assets/images/logos/Declick.svg);
  outline: 0;
}
</style>
