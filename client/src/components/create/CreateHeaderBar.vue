<template lang="pug">
.create-header-bar
  router-link.home-link(to='/')
  span.title Créer
  router-link.close-link(to='/')
</template>

<style lang="scss">
@import '~@/assets/styles/globals';

.create-header-bar {
  padding: $size-2;
  border-bottom: $size-1 solid $declick-yellow;
  background-color: $cab-sav;
  box-sizing: border-box;

  .home-link {
    display: inline-block;
    width: 45px;
    height: 45px;
    vertical-align: bottom;
    background-image: url(~@/assets/images/figures/declick-small.svg);
    cursor: pointer;
  }

  .title {
    display: inline-block;
    margin-left: 25px;
    font-family: 'Rubik', sans-serif;
    font-size: 25pt;
    font-weight: 700;
    color: $white;
  }
  .close-link {
    float: right;
    width: 42px;
    height: 42px;
    vertical-align: bottom;
    background-image: url(~@/assets/images/controls/back.svg);
    cursor: pointer;
  }
  .close-link:hover {
    // background-image: url(~@/assets/images/close-hover.png);
  }
}
</style>
