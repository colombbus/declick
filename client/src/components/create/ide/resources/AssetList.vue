<template lang="pug">
.asset-list
  .asset-list__content
    asset-item(
      v-for='asset in orderedAssets'
      @select='select (asset.id)'
      @rename='name => renameAsset(asset.id, name)'
      @destroy='destroyAsset(asset.id)'
      :key='asset.id'
      :name='asset.file_name'
      :selected='selectedId === asset.id'
      :url='generateUrl(asset)'
    )
  .asset-list__controls
    button.asset-list__new(@click='createAsset' type='button')
    button.asset-list__delete(@click='destroySelectedAsset' type='button')
</template>

<script>
import range from 'lodash.range'
import config from '@/assets/js/config'

import AssetItem from './AssetItem.vue'

export default {
  data() {
    return {
      // assets: [],
      selectedId: null,
    }
  },
  props: {
    assets: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    // range(0, 5).forEach(() => this.createAsset())
  },
  methods: {
    select(id) {
      this.selectedId = id
    },
    renameAsset(id, newName) {
      this.assets.find(asset => asset.id === id).name = newName
    },
    createAsset() {
      this.assets.push({
        id: this.generateId(),
        name: this.generateName(),
      })
    },
    destroySelectedAsset() {
      this.destroyAsset(this.selectedId)
    },
    destroyAsset(id) {
      this.assets = this.assets.filter(asset => asset.id !== id)
      if (this.selectedId === id) {
        this.selectedId = null
      }
    },
    generateName() {
      let i = 1
      const name = index => this.$t('pattern.asset.name', { index })
      while (this.assets.some(asset => asset.name === name(i))) {
        i++
      }
      return name(i)
    },
    generateId() {
      let i = 1
      while (this.assets.some(({ id }) => id === i)) {
        i++
      }
      return i
    },
    generateUrl(asset) {
      const mimeType = asset.media_type.split('/')[1]
      return `${config.apiUrl}projects/${asset.project_id}/resources/${asset.id}/content.${mimeType}`
    },
  },
  computed: {
    orderedAssets() {
      const self = this
      if (self.assets !== null) {
        return self.assets.sort((a, b) =>
          a.file_name.localeCompare(b.file_name),
        )
      } else return []
    },
  },
  components: {
    AssetItem,
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/mixins';

.asset-list {
  width: 375px;
  display: grid;
  height: 100%;
  grid-template-rows: 1fr auto;
}

.asset-list__content {
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.asset-list__controls {
  @include items-hgap(9px);

  display: flex;
  height: 36px;
  padding: 9px;
  flex-direction: row;
  justify-content: flex-end;
}

.asset-list__controls > * {
  height: 36px;
  width: 36px;
}

.asset-list {
  &__new {
    @include image-button('~@/assets/images/controls/new.svg');
  }

  &__delete {
    @include image-button('~@/assets/images/controls/delete.svg');
  }
}
</style>
