<template lang="pug">
.projects-new.container
    h2 
      router-link.go-back(:to="`/users/${$route.params.id}/projects`") {{ $t('words.my-projects') }}
      span.fa.fa-angle-right.breadcrumb-separator
      | {{ $t('words.new-project') }}
    form
      label(for="name")
        | {{ $t('words.name') }}
      input(type="text" id="name" v-model="project.name")
      label(for="description")
        | {{ $t('words.description') }}
      input(type="text" id="description" v-model="project.description")
      label(for="instructions")
        | {{ $t('words.instructions') }}
      input(type="text" id="instructions" v-model="project.instructions")
      label(for="is-default")
        | {{ $t('words.is-default') }}
      input(type="checkbox" id="is-default" v-model="project['is-default']")
      label(for="is-public")
        | {{ $t('words.is-public') }}
      input(type="checkbox" id="is-public" v-model="project['is-public']")
      label(for="scene-width")
        | {{ $t('words.scene-width') }}
      input(type="number" id="scene-width" value="1024" min="1" max="48000" v-model="project['scene-width']")
      label(for="scene-height")
        | {{ $t('words.scene-height') }}
      input(type="number" id="scene-height" value="512" min="1" max="48000" v-model="project['scene-height']")
      input.btn.btn-default(type="submit" value="validate" @click.prevent="submitNewProject")
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      project: {
        name: '',
        description: '',
        instructions: '',
        'is-default': '',
        'is-public': '',
        'scene-width': 1024,
        'scene-height': 512,
      },
    }
  },
  methods: {
    async submitNewProject() {
      const data = {
        name: this.project.name,
        isPublic: this.project['is-public'],
        sceneWidth: this.project['scene-width'],
        sceneHeight: this.project['scene-height'],
        description: this.project.description,
        instructions: this.project.instructions,
      }
      const response = await this.$store.dispatch('createProject', { data })
      this.clearFields()
      this.$router.push({ name: 'Projects list' })
      // console.log(response)
    },
    clearFields() {
      this.project = {
        name: '',
        description: '',
        instructions: '',
        'is-default': '',
        'is-public': '',
        'scene-width': 1024,
        'scene-height': 512,
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.projects-new {
  .breadcrumb-separator {
    padding: 0 $size-2;
  }

  h2 {
    display: inline-block;
    margin-right: $size-3;
  }
  form {
    display: grid;
    grid-template-columns: 1fr 6fr;
    gap: $size-2;
    justify-items: start;
  }
  label {
    justify-self: end;
    align-self: center;
    font-weight: bold;
  }
}
</style>
