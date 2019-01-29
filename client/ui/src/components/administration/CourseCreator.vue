<template lang="pug">
#course-creator.panel.panel-default
  .panel-heading(@click="newParcour = !newParcour" class="cursor") nouveau parcours
  .panel-body(v-if="newParcour")
    .form-group
      label(for='name') nom :
      input#name.form-control(type='text' name='name' v-model='name')
    .form-group
      label(for='shortDescription') description courte :
      textarea#shortDescription.form-control(name='shortDescription' v-model='shortDescription')
    .form-group
      label(for='description') description :
      textarea#description.form-control(name='description' v-model='description')
    button.btn.btn-success(type='button' @click='create') créer
</template>

<script>
import Vue from 'vue'
import config from '@/assets/config/declick'
import axios from 'axios'

export default {
  data() {
    return {
      name: '',
      shortDescription: '',
      description: '',
      newParcour: false,
    }
  },
  methods: {
    create() {
      let course = {
        name: this.name,
        short_description: this.shortDescription,
        description: this.description,
      }
      axios({
        method: 'POST',
        url: `${config.apiUrl}circuits`,
        data: course,
      }).then(() => this.$emit('course-created'))
    },
  },
}
</script>

<style lang="sass">
#course-creator
  width: 100%

.cursor
  cursor:pointer
</style>
