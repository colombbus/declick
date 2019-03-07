<template lang="pug">
.self
  .course(v-for='course in courses')
    .image-area
      img(v-if='course.imageUrl', :src='course.imageUrl')
    p.fields-area
      router-link.name(:to="'/progress/course/' + course.id") {{course.name}}
      br
      span.summary {{course.summary}}
      br
      span(v-if='!course.showDetails')
        a.toggle-details-link(@click='course.showDetails = true')
          span.glyphicon.glyphicon-triangle-right
          |
          | afficher les détails
      span(v-else)
        a.toggle-details-link(@click='course.showDetails = false')
          span.glyphicon.glyphicon-triangle-bottom
          |
          | masquer les détails
        br
        span.details {{course.details}}
</template>

<script>
import {mapActions} from 'vuex'

export default {
  data () {
    return {
      courses: []
    }
  },
  async created () {
    let courses = await this.getAllCourses()
    courses.forEach((course) => {
      course.showDetails = false
    })
    this.courses = courses
  },
  methods: mapActions(['getAllCourses'])
}
</script>

<style lang="sass" scoped>
*
  font-size: 14pt

.self
  max-width: 750px
  // @todo Find a workaround to override a property in Vue scoped CSS mode.
  margin: 0 auto !important

.course
  margin-top: 20px
  padding-left: 150px
  border: 2px solid #E7E6E6

.course:after
  content: ''
  display: block
  clear: both

.image-area
  float: left
  width: 150px
  margin-left: -150px

.fields-area
  padding: 10px

.name
  font-size: 18pt
  font-weight: 700

.summary
  color: #2E75B6

.toggle-details-link, .details
  color: #A6A6A6

.toggle-details-link
  text-decoration: none
  cursor: pointer

.details
  display: block
  margin-left: 25px
  white-space: pre-wrap

.glyphicon
  position: relative
  top: 3px
</style>
