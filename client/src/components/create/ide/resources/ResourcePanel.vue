<template lang="pug">
.resource-panel(:class='`resource-panel--${view}`')
  program-list(
    v-show="view === 'programs'" 
    @select="$emit('select', $event)"
    @rename="renameResource"
    @delete-program="deleteResource"
    :programs="programs"
  )
  asset-list(
    v-show="view === 'assets'"
    :assets="assets"
  )
  .resource-panel__tabs
    button.resource-panel__switch-programs(@click="view = 'programs'" type='button')
    button.resource-panel__switch-assets(@click="view = 'assets'" type='button')
</template>

<script>
import AssetList from './AssetList.vue'
import ProgramList from './ProgramList.vue'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      view: 'programs',
      programs: null,
      assets: null,
    }
  },
  mounted() {
    if (this.$store.state.user) {
      this.getResources()
    }
  },
  methods: {
    async getResources() {
      const currentProjectId = this.$store.state.user.currentProjectId
      const resources = await this.getAllProjectResources(currentProjectId)
      this.programs = resources.filter(
        r => r.media_type === 'text/vnd.colombbus.declick.script',
      )
      this.assets = resources.filter(r => r.media_type.includes('image'))
    },
    deleteResource(selectedId) {
      this.programs = this.programs.filter(program => program.id !== selectedId)
    },
    async renameResource(id, newName) {
      this.programs.find(program => program.id === id).file_name = newName
      await this.updateProjetResource({ id, file_name: newName })
    },
    async saveResource(id, newName) {
      this.programs.find(program => program.id === id).file_name = newName
      await this.updateProjetResource({ id, file_name: newName })
    },
    ...mapActions(['getAllProjectResources', 'updateProjetResource']),
  },
  watch: {
    '$store.state.user': function(user) {
      this.getResources()
    },
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
    @include image-button('~@/assets/images/controls/programs.svg');
  }

  &__switch-assets {
    @include image-button('~@/assets/images/controls/assets.svg');
  }
}

.resource-panel--programs {
  .resource-panel__switch-programs {
    background-color: #a6a1a6;
    // background-image: url('~@/assets/images/controls/programs-active.png');
  }
}

.resource-panel--assets {
  .resource-panel__switch-assets {
    background-color: #a6a1a6;
    // background-image: url('~@/assets/images/controls/assets-active.png');
  }
}
</style>
