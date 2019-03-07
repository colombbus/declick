<template>
  <div>
    <input
      type="text"
      class="form-control"
      placeholder="recherche par nom"
      disabled="disabled"
    >
    <table class="table table-hover">
      <thead>
        <tr>
          <th>identifiant</th>
          <th>nom</th>
          <th>description courte</th>
          <th><!-- actions --></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" class="list-group">
          <td>{{ course.id }}</td>
          <td>{{ course.name }}</td>
          <td>{{ course.short_description }}</td>
          <td>
            <router-link
              :to="'/administration/courses/' + course.id"
              class="btn btn-default"
            >modifier</router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <course-creator @course-created="loadcourseList"></course-creator>
  </div>
</template>

<script>
// TODO: use store

import CourseCreator from './CourseCreator'
import config from 'assets/config/declick'

export default {
  data () {
    return {
      courses: []
    }
  },
  async created () {
    let endpoint = `${config.apiUrl}v1/circuits`
    let {body} = await this.$http.get(endpoint)
    this.courses = body
  },
  components: {
    CourseCreator
  }
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
