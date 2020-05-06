<template lang="pug">
.resource-panel(:class='`resource-panel--${view}`')
  program-list(v-show="view === 'programs'" @select="$emit('select',$event)")
  asset-list(v-show="view === 'assets'")
  .resource-panel__tabs
    button.resource-panel__switch-programs(@click="view = 'programs'" type='button')
    button.resource-panel__switch-assets(@click="view = 'assets'" type='button')
</template>

<script>
import AssetList from './AssetList.vue'
import ProgramList from './ProgramList.vue'

export default {
  data() {
    return {
      view: 'programs',
    }
  },
  components: {
    AssetList,
    ProgramList,
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/mixins';

.resource-panel {
  display: grid;
  height: 100%;
  grid-template-columns: auto auto;
  grid-template-rows: 100%;
  background: #a6a1a6;
}

.resource-panel__tabs {
  display: flex;
  flex-direction: column;
  background: #ddd6dd;
}

.resource-panel__tabs > * {
  height: 45px;
  width: 65px;
}

// TODO: Find a better solution to handle buttons active state.

.resource-panel {
  &__switch-programs {
    @include image-button('~@/assets/images/controls/programs.png');
  }

  &__switch-assets {
    @include image-button('~@/assets/images/controls/assets.png');
  }
}

.resource-panel--programs {
  .resource-panel__switch-programs {
    background-color: #a6a1a6;
    background-image: url('~@/assets/images/controls/programs-active.png');
  }
}

.resource-panel--assets {
  .resource-panel__switch-assets {
    background-color: #a6a1a6;
    background-image: url('~@/assets/images/controls/assets-active.png');
  }
}
</style>
