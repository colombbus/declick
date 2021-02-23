<template lang="pug">
.main-bar
  button.main-bar__help(
    @click="$emit('toggle-help')"
    type='button'
    :class="helpVisible ? 'main-bar__help--active': null"
  )
  button.main-bar__hints(type='button')
  DButton(name="back.js")
  button.main-bar__play(
    type='button'
    @click="$emit('execute')"
  )
  button.main-bar__save(type='button' @click="$emit('save-file-content')")
</template>

<script>
import DButton from '@/components/miscellaneous/DButton'
export default {
  props: ['helpVisible'],
  components: { DButton },
}
</script>

<style lang="scss">
@import '~@/assets/styles/mixins';
@import '~@/assets/styles/globals';

.main-bar {
  @include items-hgap($size-2);

  display: flex;
  padding: $size-2;
  align-items: center;
  justify-items: center;
  background: #ddd6dd;
}

.main-bar > * {
  height: 36px;
  width: 36px;
}

//         ,~ ,
//         )))Y
//        ((((,\________________
//        \)/( [_____________
//        (   \  |  [_]   [_]
//         )___\ |   |     |
//         (| (\ |   |     |
//  ejm    q`_ q`_  _|_   _|_

.main-bar {
  &__help {
    @include image-button('~@/assets/images/controls/buoy.svg');
  }

  &__hints {
    @include image-button('~@/assets/images/controls/help.svg');

    margin-right: auto;
  }

  &__play {
    @include image-button('~@/assets/images/controls/play.svg');
  }

  &__save {
    @include image-button('~@/assets/images/controls/save.svg');

    margin-left: auto;
  }
}

.main-bar__help--active {
  background-image: url('~@/assets/images/controls/buoy.svg');
}
</style>
