<template lang="pug">
.course-list
  .course(v-for='course in courses')
    .image-area
      img(v-if='course.imageUrl', :src='getImg(course)')
    p.fields-area
      router-link.name(:to="'/progress/course/' + course.id") {{course.name}}
      br
      p.summary(v-html="course.summary")
      br
      div(v-if='course.details')
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
          span.details(v-html="course.details")
</template>

<script>

  import {mapActions} from 'vuex'

  export default {
    metaInfo: {
      // Children can override the title.
      title: 'Apprendre',
      // Result: My Page Title ← My Site
      // If a child changes the title to "My Other Page Title",
      // it will become: My Other Page Title ← My Site
      titleTemplate: '%s - Colombbus',
      // Define meta tags here.
      meta: [
        {'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {vmid: 'description', name: 'description', content: 'Apprend a utilisé declick grace au parcourt'},
      ]
    },
    data () {
      return {
        courses: []
      }
    },
    methods: {
      getImg (course) {
        return "//v2.declick.net/images/" + course.id + ".png"
      },
      ...mapActions(['getAllCourses'])
    },
    async created () {
      let courses = await this.getAllCourses()
      courses.forEach((course) => {
        course.showDetails = false
      })
      this.courses = courses
      // console.log(this.courses[0])
    },
  }
</script>

<style lang="sass" scoped>
*
  font-size: 14pt

.course-list
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
  padding: 0 10px

.toggle-details-link, .details
  color: #A6A6A6

.toggle-details-link
  text-decoration: none
  cursor: pointer

.details
  display: block
  margin-left: 25px
  white-space: pre-wrap
  padding: 0 10px

.glyphicon
  position: relative
  top: 3px
</style>
