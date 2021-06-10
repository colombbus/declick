<template lang="pug">
iframe.help(
  :src='wikiUrl'
  sandbox='allow-same-origin'
)
</template>
<script>
import { wikiUrl } from '@/assets/js/config.js'

export default {}
</script>
<style lang="scss">
.help {
  height: 100%;
  border: none;
}
</style>
