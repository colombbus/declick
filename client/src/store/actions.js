import * as mutations from './mutation-types'

import Api from '@/api'

const LOCAL_STORAGE_PREFIX = 'ui'
const LOCAL_STORAGE_VERSION = 5

export const setCurrentProgramName = async ({ commit }, { name }) => {
  commit(mutations.CURRENT_PROGRAM, { name })
}

export const setCurrentProgramContent = async ({ commit }, { id, content }) => {
  commit(mutations.CURRENT_CODE_UPDATE, { id, content })
}

export const loadExecuteProject = async ({ state, commit }, { id }) => {
  const project = await Api.getProject(id, state.token)
  const resources = await Api.getAllProjectResources(project.id)
  let program = null
  if (project.mainProgramId) {
    ;[{ file_name: program }] = resources.filter(
      resource => resource.id === project.mainProgramId,
    )
  }
  commit('setExecuteProject', {
    sceneHeight: project.sceneHeight,
    sceneWidth: project.sceneWidth,
    mainProgram: program,
    id: project.id,
    name: project.name,
  })
}

export const register = async ({ dispatch }, { username, email, password }) => {
  await Api.createUser({ username, email, password })
  await dispatch('logIn', { username, password })
}

export const autoLogIn = async ({ dispatch }) => {
  const version = getLocalItem('version')
  if (version === null || parseInt(version) !== LOCAL_STORAGE_VERSION) {
    clearLocalItems()
  } else {
    const token = getLocalItem('token')
    dispatch('logIn', { token })
  }
}

export const logIn = async (
  { commit, dispatch },
  { username, password, token },
) => {
  if (!token) {
    token = await Api.createToken(username, password)
  }
  const user = await Api.getUserByToken(token)
  commit(mutations.LOG_IN, { token, user })
  setLocalItem('version', LOCAL_STORAGE_VERSION)
  setLocalItem('token', token)
  const projectId = user.currentProjectId || user.defaultProjectId
  const project = await Api.getProject(projectId, token)
  commit(mutations.PROJECT_SELECTION, { project })
  dispatch('loadCurrentCourseResults')
}

export const logOut = async ({ commit, dispatch, state }, { token }) => {
  clearLocalItems()
  Api.destroyToken(state.token)
  commit(mutations.LOG_OUT)
  dispatch('loadCurrentCourseResults')
}

export const getAllCourses = async () => {
  return await Api.getAllCourses()
}

export const registerCurrentAssessmentResult = async (
  { commit, state: { token, user, currentAssessment } },
  data,
) => {
  if (user) {
    await Api.registerUserResult(user.id, currentAssessment.id, data, token)
  }
  commit(mutations.ASSESSMENT_RESULT, {
    id: currentAssessment.id,
    result: data,
  })
}

export const selectCourse = async ({ commit, dispatch, state }, { id }) => {
  const token = state.token
  if (state.currentCourseId === parseInt(id)) {
    return
  }
  const assessments = await Api.getAllCourseAssessments(id)
  if (state.currentCourseId !== parseInt(id)) {
    commit(mutations.COURSE_SELECTION, {
      id: parseInt(id),
      course: assessments,
    })
    if (token === state.token) {
      dispatch('loadCurrentCourseResults')
    }
  }
}

export const loadCurrentCourseResults = async ({ commit, state }) => {
  const { user, token } = state
  if (state.currentCourse) {
    if (user) {
      const results = await Api.getAllUserResults(user.id, token)
      if (token === state.token) {
        const filteredResults = []
        state.currentCourse.forEach(assessment => {
          const result = results.reduce((selectedResult, currentResult) => {
            if (currentResult.assessmentId === assessment.id) {
              if (!selectedResult) {
                return currentResult
              } else if (selectedResult.passed && !currentResult.passed) {
                return selectedResult
              } else {
                return currentResult
              }
            }
            return selectedResult
          }, null)
          if (result) {
            filteredResults.push(result)
          }
        })
        commit(mutations.RECEIVE_RESULTS, { results: filteredResults })
      }
    } else {
      commit(mutations.RECEIVE_RESULTS, { results: [] })
    }
  }
}

export const selectAssessment = async ({ dispatch, commit, state }, { id }) => {
  commit(mutations.ASSESSMENT_SELECTION, { id })
  await dispatch('registerCurrentAssessmentResult', {})
}

export const selectPreviousAssessment = ({ dispatch, state }) => {
  let currentPosition = null
  for (let index = 0; index < state.currentCourse.length; index++) {
    let currentItem = state.currentCourse[index]
    if (currentItem.id === state.currentAssessment.id) {
      currentPosition = index
      break
    }
  }
  if (currentPosition !== null && state.currentCourse[currentPosition - 1]) {
    dispatch('selectAssessment', {
      id: state.currentCourse[currentPosition - 1].id,
    })
  }
}

export const selectNextAssessment = ({ dispatch, state }) => {
  let currentPosition = null
  for (let index = 0; index < state.currentCourse.length; index++) {
    let currentItem = state.currentCourse[index]
    if (currentItem.id === state.currentAssessment.id) {
      currentPosition = index
      break
    }
  }
  if (currentPosition !== null && state.currentCourse[currentPosition + 1]) {
    dispatch('selectAssessment', {
      id: state.currentCourse[currentPosition + 1].id,
    })
  }
}

export const createProject = async ({ commit, state }, { data }) => {
  const project = await Api.createProject(data, state.token)
  await Api.updateUser(
    state.user.id,
    {
      currentProjectId: project.id,
    },
    state.token,
  )
  commit(mutations.PROJECT_SELECTION, { project })
}

export const selectProject = async ({ commit, state }, { id }) => {
  await Api.updateUser(
    state.user.id,
    {
      currentProjectId: id,
    },
    state.token,
  )
  const project = await Api.getProject(id, state.token)
  commit(mutations.PROJECT_SELECTION, { project })
}

export const updateProject = async ({ state }, { id, data }) => {
  return await Api.updateProject(id, data, state.token)
}

export const getAllUserProjects = async ({ state }) => {
  return await Api.getAllUserProjects(state.user.id, state.token)
}

export const getAllProjectResources = async ({ state }) => {
  return await Api.getAllProjectResources(
    // state.user.currentProjectId,
    4629,
    state.user.token,
  )
}

function getLocalItem(key) {
  return localStorage.getItem(`${LOCAL_STORAGE_PREFIX}.${key}`)
}

function setLocalItem(key, value) {
  return localStorage.setItem(`${LOCAL_STORAGE_PREFIX}.${key}`, value)
}

function clearLocalItems() {
  const keys = []
  for (let index = 0; index < localStorage.length; index++) {
    keys.push(localStorage.key(index))
  }
  let prefixLength = LOCAL_STORAGE_PREFIX.length
  keys.forEach(key => {
    if (key.substr(0, prefixLength + 1) === `${LOCAL_STORAGE_PREFIX}.`) {
      localStorage.removeItem(key)
    }
  })
}
