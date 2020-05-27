<template lang="pug">
.preview-bar
  button.preview-bar__help(
    @click="$emit('toggle-help')"
    type='button' 
    :class="helpVisible ? 'preview-bar__help--active': null"
  )
  button.preview-bar__hints(type='button')
  button.preview-bar__design-mode(type='button')
  button.preview-bar__floating-controller(type='button')
</template>

<script>
export default {
  props: ['helpVisible'],
}
</script>

<style lang="scss">
@import '~@/assets/styles/mixins';

.preview-bar {
  @include items-hgap(9px);

  display: flex;
  padding: 9px;
  align-items: center;
  justify-items: center;
  background: #ddd6dd;
}

.preview-bar > * {
  height: 36px;
  width: 36px;
}

.preview-bar {
  &__help {
    @include image-button('~@/assets/images/controls/buoy.svg');
  }

  &__hints {
    @include image-button('~@/assets/images/controls/help.svg');

    margin-right: auto;
  }

  &__design-mode {
    @include image-button('~@/assets/images/controls/crane.svg');

    margin-left: auto;
  }

  &__floating-controller {
    @include image-button('~@/assets/images/controls/controller.svg');
  }
}

.preview-bar__help--active {
  // background-image: url(~@/assets/images/controls/buoy.svg);
}
</style>
