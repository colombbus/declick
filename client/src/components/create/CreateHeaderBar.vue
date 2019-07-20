<template lang="pug">
.self
  router-link.home-link(to='/')
  span.title Créer
  router-link.close-link(to='/')
</template>

<style lang="scss" scoped>
.self {
  padding: 5px 10px;
  border-bottom: 5px solid #d1d718;
  background-color: #480a2a;
}
.home-link {
  display: inline-block;
  width: 45px;
  height: 45px;
  vertical-align: bottom;
  background-image: url(~@/assets/images/mini-logo.png);
  cursor: pointer;
}

.title {
  display: inline-block;
  margin-left: 25px;
  font-family: 'Rubik', sans-serif;
  font-size: 25pt;
  font-weight: 700;
  color: white;
}
.close-link {
  display: inline-block;
  float: right;
  width: 42px;
  height: 42px;
  vertical-align: bottom;
  background-image: url(~@/assets/images/close-2.png);
  cursor: pointer;
}
.close-link:hover {
  background-image: url(~@/assets/images/close-hover.png);
}
</style>
