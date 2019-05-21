<template>
  <div><img src="../assets/404.png" alt=""></div>
</template>
<script>
export default {
    metaInfo: () => ({
    title: 'Declick',
    titleTemplate: '%s ',
    meta: [
      { name: 'description', content: 'page 404'}
    ],
  }),
}
</script>
<style scoped>
  div{
    display: flex;
    align-items: center;
    justify-content: center;
  }
div img{
  width: 50vw;
  margin-top: 50px
}
@media only screen and (max-width: 576px){
  div img{
  width: 80vw;
  }
}
</style>
