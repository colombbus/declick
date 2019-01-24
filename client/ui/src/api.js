// import Vue from 'vue'
// import VueResource from 'vue-resource'
import axios from 'axios'
// TODO: Update this file to use axios.
import config from '@/assets/config/declick'

// Vue.use(VueResource)

export default {
  // tokens methods
  async createToken(username, password) {
    let url = `${config.apiUrl}login`

    let {
      data: { token },
    } = await axios({
      method: 'post',
      url,
      data: {
        username,
        password,
      },
    })

    return token
  },
  async destroyToken(token) {
    let url = `${config.apiUrl}logout`

    await axios({
      url,
      headers: {
        Authorization: 'Token ' + token,
      },
    })
  },

  // users methods
  async createUser({ username, email, password }) {
    let url = `${config.apiUrl}users`

    await axios({
      url,
      data: {
        username,
        email,
        password,
      },
    })
  },
  async updateUser(id, user, token) {
    let url = `${config.apiUrl}users/${id}`
    let body = {
      email: user.email,
      id_admin: user.isAdmin,
      default_project_id: user.defaultProjectId,
      current_project_id: user.currentProjectId,
    }

    let { data } = await axios({
      method: 'patch',
      url,
      data: body,
      headers: {
        Authorization: 'Token ' + token,
      },
    })

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      isAdmin: data.is_admin,
      defaultProjectId: data.default_project_id,
      currentProjectId: data.current_project_id,
    }
  },
  async getUsersByPage(page, filter) {
    let url = `${config.apiUrl}users?page=${page}`

    if (filter && filter !== '') {
      url += `&search=${filter}`
    }

    let { data } = await axios({
      method: 'get',
      url,
    })

    let users = data.data.map(user => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.is_admin,
        defaultProjectId: user.default_project_id,
        currentProjectId: user.current_project_id,
      }
    })

    return {
      items: users,
      currentPage: data.current_page,
      lastPage: data.last_page,
    }
  },
  async getUser(id) {
    let url = `${config.apiUrl}users/${id}`
    let { data } = await axios({
      url,
    })
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      defaultProjectId: data.default_project_id,
      currentProjectId: data.current_project_id,
      isAdmin: data.is_admin,
    }
  },
  async getUserByToken(token) {
    let url = `${config.apiUrl}users/me`
    // headersToken = 'Authorization: Token ' + token;

    let { data } = await axios({
      method: 'get',
      url,
      headers: {
        Authorization: 'Token ' + token,
      },
    })

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      defaultProjectId: data.default_project_id,
      currentProjectId: data.current_project_id,
      isAdmin: data.is_admin,
    }
  },

  // projects methods
  async createProject(user, token) {
    let url = `${config.apiUrl}projects`
    let body = {
      name: user.name,
      is_public: user.isPublic,
      scene_width: user.sceneWidth,
      scene_height: user.sceneHeight,
      description: user.description,
      instructions: user.instructions,
    }
    let { data } = await axios({
      method: 'post',
      url,
      data: body,
      headers: {
        Authorization: 'Token ' + token,
      },
    })

    return {
      id: data.id,
      name: data.name === '' && data.is_default ? 'Mon projet' : data.name,
      isPublic: data.is_public,
      isDefault: data.is_default,
      sceneWidth: data.scene_width,
      sceneHeight: data.scene_height,
      description: data.description,
      instructions: data.instructions,
      mainProgramId: data.main_program_id,
    }
  },
  async updateProject(id, project, token) {
    let url = `${config.apiUrl}projects/${id}`
    let body = {
      name: project.name,
      is_public: project.isPublic,
      scene_width: project.sceneWidth,
      scene_height: project.sceneHeight,
      description: project.description,
      instructions: project.instructions,
      main_program_id: project.mainProgramId,
    }
    let { data } = await axios({
      method: 'patch',
      url,
      data: body,
      headers: {
        Authorization: 'Token ' + token,
      },
    })
    return {
      id: data.id,
      name: data.name === '' && data.is_default ? 'Mon projet' : data.name,
      isPublic: data.is_public,
      isDefault: data.is_default,
      sceneWidth: data.scene_width,
      sceneHeight: data.scene_height,
      description: data.description,
      instructions: data.instructions,
      mainProgramId: data.main_program_id,
    }
  },
  async getProject(id, token) {
    let url = `${config.apiUrl}projects/${id}`

    let { data } = await axios({
      method: 'get',
      url,
      headers: {
        Authorization: 'Token ' + token,
      },
    })

    return {
      id: data.id,
      name: data.name === '' && data.is_default ? 'Mon projet' : data.name,
      isPublic: data.is_public,
      isDefault: data.is_default,
      sceneWidth: data.scene_width,
      sceneHeight: data.scene_height,
      description: data.description,
      instructions: data.instructions,
      mainProgramId: data.main_program_id,
    }
  },
  async getAllUserProjects(id, token) {
    let url = `${config.apiUrl}users/${id}/projects`

    let { data } = await axios({
      method: 'get',
      url,
      headers: {
        Authorization: 'Token ' + token,
      },
    })
    return data.map(project => {
      return {
        id: project.id,
        name:
          project.name === '' && project.is_default
            ? 'Mon projet'
            : project.name,
        isPublic: project.is_public,
        isDefault: project.is_default,
        sceneWidth: project.scene_width,
        sceneHeight: project.scene_height,
        description: project.description,
        instructions: project.instructions,
      }
    })
  },
  async deleteProject(id, token) {
    let url = `${config.apiUrl}projects/${id}`
    await axios({
      method: 'delete',
      url,
      headers: {
        Authorization: 'Token ' + token,
      },
    })
  },

  // project resources methods
  async getAllProjectResources(id, token) {
    const endpoint = `${config.apiUrl}projects/${id}/resources`
    const { data } = await axios({
      method: 'get',
      endpoint,
      headers: {
        Authorization: 'Token ' + token,
      },
    })
    return data
  },

  // courses methods
  async getAllCourses() {
    let url = `${config.apiUrl}circuits`
    let { data } = await axios({
      method: 'get',
      url,
    })
    return data.map(course => {
      return {
        id: course.id,
        name: course.name,
        imageUrl: 'http://www.declick.net/images/default-level.png',
        summary: course.short_description,
        details: course.description,
      }
    })
  },

  // assessments methods
  async getAllCourseAssessments(id) {
    let url = `${config.apiUrl}circuits/${id}/nodes`
    let { data } = await axios({
      method: 'get',
      url,
    })
    let assessments = data.map(assessment => {
      return {
        id: assessment.id,
        name: assessment.name,
        url: assessment.link,
        circuitId: assessment.circuit_id,
        parentId: assessment.parent_id,
        position: assessment.position,
      }
    })
    let root = assessments.filter(
      assessments => assessments.parentId === null,
    )[0]
    let result = orderAssessments(assessments, root)
    return result
  },

  // results methods
  async registerUserResult(userId, assessmentId, data, token) {
    let url = `${config.apiUrl}users/${userId}/results`
    let body = {
      step_id: assessmentId,
      passed: data.passed,
      solution: data.solution,
    }
    console.log(body, data)

    await axios({
      method: 'post',
      url,
      data: body,
      headers: {
        Authorization: 'Token ' + token,
      },
    })
  },
  async getAllUserResults(id, token) {
    let url = `${config.apiUrl}users/${id}/results`
    let { data } = await axios({
      method: 'get',
      url,
      headers: {
        Authorization: 'Token ' + token,
      },
    })
    let results = data.map(result => {
      return {
        id: result.id,
        userId: result.user_id,
        assessmentId: result.step_id,
        passed: result.passed,
        solution: result.solution,
      }
    })
    return results
  },

  async importProject(id, token) {
    let url = `${config.apiUrl}projects/import/${id}`
    await axios({
      method: 'post',
      url,
      data: {},
      headers: {
        Authorization: 'Token ' + token,
      },
    })
  },
}

function orderAssessments(assessments, root, state) {
  if (!state) {
    state = {
      stack: [],
      count: 0,
    }
  }
  assessments
    .filter(assessment => assessment.parentId === root.id)
    .sort((assessmentA, assessmentB) => {
      return assessmentA.position - assessmentB.position
    })
    .forEach(assessment => {
      assessment.position = state.count++
      state.stack.push(assessment)
      orderAssessments(assessments, assessment, state)
    })
  return state.stack
}
