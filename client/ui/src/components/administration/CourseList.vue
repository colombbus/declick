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
import Api from '@/api'

export default {
  data () {
    return {
      courses: []
    }
  },
  methods: {
    async loadcourseList(){
      let body = await Api.getAllCourses()
      this.courses = body
    }
  },
  created () {    
    this.loadcourseList()
  },
  components: {
    CourseCreator
  }
}
</script>
