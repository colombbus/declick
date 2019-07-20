import Vue from 'vue'
import * as mutations from './mutation-types.js'

export default {
  setExecuteProject(state, project) {
    state.executeProject = project
  },
  [mutations.LOG_IN](state, { token, user }) {
    state.token = token
    state.user = user
  },
  [mutations.LOG_OUT](state) {
    state.token = null
    state.user = null
    state.currentProject = null
  },
  [mutations.PROJECT_SELECTION](state, { project }) {
    state.currentProject = project
  },
  [mutations.COURSE_SELECTION](state, { id, course }) {
    state.currentAssessment = null
    state.currentCourseId = id
    state.currentCourse = course
    state.currentCourseResults = []
  },
  [mutations.ASSESSMENT_SELECTION](state, { id }) {
    let [assessment] = state.currentCourse.filter(
      assessment => assessment.id === id,
    )
    if (assessment) {
      state.currentAssessment = assessment
    } else {
      state.currentAssessment = null
    }
  },
  [mutations.RECEIVE_RESULTS](state, { results }) {
    state.currentCourseResults = results
  },

  [mutations.ASSESSMENT_RESULT](state, { id, result }) {
    let [resultEntry] = state.currentCourseResults.filter(
      resultItem => resultItem.assessmentId === id,
    )
    if (resultEntry) {
      if (resultEntry.passed && !result.passed) {
        return
      }
      Vue.set(resultEntry, 'visited', true)
      Vue.set(resultEntry, 'passed', result.passed)
      resultEntry.solution = result.solution
    } else {
      state.currentCourseResults.push({
        assessmentId: id,
        visited: true,
        passed: result.passed,
        solution: result.solution,
      })
    }
  },

  [mutations.CURRENT_CODE_UPDATE](state, { result }) {
    state.currentCode = result
  }
}
