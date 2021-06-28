<template lang="pug">
.custom-loader
  svg-icon.cog.hour-spin(icon='spinner')
  svg-icon.cog.antihour-spin(icon='spinner')
</template>

<script>
import SvgIcon from './SvgIcon.vue'
export default {
  components: {
    SvgIcon,
  },
}
</script>

<style lang="scss">
.custom-loader {
  height: 7rem;
}
.icon.cog {
  height: 4rem;
  width: 4rem;
  &.antihour-spin {
    animation: antihour-spin 5s infinite linear;
    fill: var(--yellow);
  }
  &.hour-spin {
    animation: hour-spin 5s infinite reverse linear;
    fill: #652e46;
  }
}

@keyframes antihour-spin {
  from {
    transform: translate(-25px, 45px) rotate(0deg);
  }
  to {
    transform: translate(-25px, 45px) rotate(359deg);
  }
}
@keyframes hour-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
