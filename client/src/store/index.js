import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const state = {
  token: null,
  user: null,
  currentProject: null,
  currentCourse: null,
  currentCourseResults: null,
  currentAssessment: null,
  currentProgramName: null,
  executeProject: null,
  programs: new Map(),
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})

/*
- token
- user
- course
- stage
- project

# methods (manual)

- register
- logIn
- restoreSession
  // stocker le token et afficher une apparence de transition
- logOut

- selectCourse
- selectStage
- previousStage
- nextStage
- submitAttempt

- createProject
- selectProject
- updateProject

# methods (subroutines) // Est-ce utile d'en faire des actions ? voir cas par cas ou même ne pas mettre dans le store du tout

- getCourseAttempts
- getUserProjects
*/
