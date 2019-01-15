<template lang="pug">
div
  input.form-control(type='text'
   placeholder='recherche par nom'
   disabled='disabled'
  )
  table.table.table-hover
    thead
      tr
        th identifiant
        th nom
        th description courte
        th
          // actions
    tbody
      tr.list-group(v-for='course in courses')
        td {{ course.id }}
        td {{ course.name }}
        td {{ course.short_description }}
        td
          router-link.btn.btn-default(:to="'/administration/courses/' + course.id") modifier
  course-creator(@course-created='loadcourseList')
</template>

<script>
// TODO: use store

import CourseCreator from './CourseCreator'
import config from '@/config'

export default {
  data () {
    return {
      courses: []
    }
  },
  async created () {
    let endpoint = `${config.apiUrl}ircuits`
    let {body} = await this.$http.get(endpoint)
    this.courses = body
  },
  components: {
    CourseCreator
  }
}
</script>
