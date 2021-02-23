<template lang="pug">
my-component.dbutton
</template>

<script>
export default {
  data() {
    return {
      //   comp: null,
    }
  },
  //   async mounted() {
  //     import('@/assets/images/controls/back.svg?inline').then(
  //       component => {
  //         console.log('this', this)
  //         console.log('component', component)
  //       },
  //       //   (this.comp = component)},
  //     )
  //   },
  props: { filename: { type: String } },
  //   created() {
  //     // The `[request]` placeholder is replaced
  //     // by the filename of the file which is
  //     // loaded (e.g. `AppIcon-music.js`).
  //     import(/* webpackChunkName: "AppIcon-[request]" */ `${this.filename}`)
  //   },
  components: {
    'my-component': () =>
      import(
        /* webpackChunkName: "AppIcon-[request]" */ '@/assets/images/controls/back.svg?inline'
      ),

    // 'my-component': function(resolve) {
    //   // This special require syntax will instruct Webpack to
    //   // automatically split your built code into bundles which
    //   // are loaded over Ajax requests.
    //   require(['@/assets/images/controls/back.svg'], resolve)
    // },

    // function(resolve, reject) {
    //   setTimeout(function() {
    //     // Pass the component definition to the resolve callback
    //     resolve(import('@/assets/images/controls/back.svg?inline'))
    //   }, 1000)
    // },
  },
}
</script>

<style lang="scss">
.dbutton {
}
</style>
