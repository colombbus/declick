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
