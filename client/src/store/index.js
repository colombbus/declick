import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)
const content = `s = new Sprite();
répéter() {
    if (clavier.droite) {
        s.avancer(10)
    }
    if (clavier.gauche) {
        s.reculer(10)
    }
    if (clavier.haut) {
        s.monter(10)
    }
    if (clavier.bas) {
        s.descendre(10)
    }
}`
const programs = new Map()
programs.set('nouveau 1', content)
programs.set('nouveau 2', 'contenu 2')
programs.set('nouveau 3', 'contenu 3')
programs.set('nouveau 4', 'contenu 4')
programs.set('nouveau 5', 'contenu 5')

export default new Vuex.Store({
  state: {
    token: null,
    user: null,
    currentProject: null,
    currentCourse: null,
    currentCourseResults: null,
    currentAssessment: null,
    currentCode: null,
    currentProgram: null,
    executeProject: null,
    programs,
  },
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
