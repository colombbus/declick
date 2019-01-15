<template lang="pug">
#course-creator.panel.panel-default
  .panel-heading nouveau parcours
  .panel-body
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
import config from '@/config'

export default {
  data () {
    return {
      name: '',
      shortDescription: '',
      description: ''
    }
  },
  methods: {
    create () {
      let course = {
        name: this.name,
        short_description: this.shortDescription,
        description: this.description
      }
      Vue.http.post(`${config.apiUrl}v1/circuits`, course).then(() =>
        this.$emit('course-created')
      )
    }
  }
}
</script>

<style lang="sass">
#course-creator
  width: 100%
</style>
