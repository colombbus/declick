<template lang="pug">
div(v-if='rootNode')
  tree-view#course-tree-view(:node='rootNode', @select-node='selectNode')
  step-editor#course-step-editor(
    v-if='selectedNode'
    :node='selectedNode'
    @create-child='createChildStep'
    @save='saveStep'
    @remove='removeStep'
  )
  div#themeEditor
    select(v-model="themeStyle")
      option monokai
      option dracula
      option chrome
      option github
  div#courseModificationContainer
    div(v-for="content,index in currentContent" :key="index")
      span( v-html="content[0]")
      br
      editor( v-model="content[1]" @init="editorInit" :lang="selectLangage(content[0])" :theme="themeStyle")
      div
        button(v-if="selectedNode" @click="saveResourceChange(content,index,content[2])") update resources
</template>

<script>
/* global $ */

import StepEditor from './StepEditor'
import TreeView from './TreeView'
import config from '@/assets/config/declick'

import axios from 'axios'

import Api from '@/api'

import { mapState, mapActions } from 'vuex'

export default {
  data: function() {
    return {
      courseId: null,
      course: null,
      rootNode: null,
      selectedNode: null,
      currentContent: {},
      themeStyle: 'monokai',
    }
  },
  watch: {
    async selectedNode() {
      this.currentContent = await Api.getExerciceResourceContent(
        this.selectedNode.data.id,
        this.token,
      )
    },
  },
  created() {
    this.courseId = this.$route.params.id
    this.retrieveCourse()
  },
  computed: {},
  methods: {
    selectLangage(id) {
      switch (id) {
        case 'solution':
          return 'javascript'
        case 'instructions.html' || 'lesson.html':
          return 'html'
        case 'exercise':
          return 'javascript'
        default:
          return 'html'
      }
    },
    editorInit: function() {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/html')
      require('brace/mode/javascript') //language
      require('brace/mode/less')
      require('brace/theme/dracula')
      require('brace/theme/chrome')
      require('brace/theme/monokai')
      require('brace/theme/github')
      require('brace/snippets/javascript') //snippet
    },
    async saveResourceChange(currentContent, resource_id, projectID) {
      console.log(currentContent)
      await axios({
        url: `${
          config.apiUrl
        }projects/${projectID}/resources/${resource_id}/contentExercise`,
        method: 'PATCH',
        data: currentContent[1],
        headers: {
          Authorization: 'Token ' + this.token,
        },
      }).then(r => {
        console.log(r)
      })
    },
    async retrieveCourse() {
      await axios({
        method: 'get',
        url: `${config.apiUrl}circuits/${this.courseId}`,
      }).then(e => {
        this.course = e.data
        this.retrieveRootStep(this.course.root_node_id)
      })
    },
    async retrieveRootStep(stepId) {
      await axios({
        method: 'GET',
        url: `${config.apiUrl}circuits/${this.courseId}/nodes/${stepId}`,
      }).then(e => {
        this.rootNode = this.makeNode(e.data)
        this.rootNode.name = 'nœud racine'
        this.rootNode.editable = false
        this.retrieveStepChildren(this.rootNode)
      })
    },
    async retrieveStepChildren(parentNode) {
      await axios({
        method: 'GET',
        url:
          `${config.apiUrl}` +
          `circuits/${this.courseId}` +
          `/nodes/${parentNode.data.id}` +
          `/children`,
      }).then(e => {
        for (let childStep of e.data) {
          let childNode = this.makeNode(childStep)
          parentNode.children.push(childNode)
          this.retrieveStepChildren(childNode)
        }
      })
    },
    createChildStep(parentNode) {
      let newStep = this.makeStep()
      newStep.parent_id = parentNode.data.id
      newStep.position = parentNode.children.length
      axios({
        method: 'POST',
        url: `${config.apiUrl}circuits/${this.courseId}/nodes`,
        data: newStep,
        success: createdStep => {
          let createdNode = this.makeNode(createdStep)
          parentNode.children.push(createdNode)
        },
      })
    },
    saveStep(node) {
      axios({
        method: 'PATCH',
        url: `${config.apiUrl}circuits/${this.courseId}/nodes/${node.data.id}`,
        data: node.data,
        success: step => {
          node.data = step
        },
      })
    },
    removeStep(node) {
      axios({
        method: 'DELETE',
        url: `${config.apiUrl}circuits/${this.courseId}/nodes/${node.data.id}`,
        success: () => {
          this.retrieveCourse()
        },
      })
    },
    makeStep() {
      return {
        name: 'nouveau nœud',
        url: null,
        parent_id: null,
        position: null,
      }
    },
    makeNode(step) {
      if (!step) {
        step = this.makeStep()
      }
      return {
        name: step.name,
        children: [],
        data: step,
        editable: true,
      }
    },
    selectNode(node) {
      this.selectedNode = node
    },
  },
  components: {
    StepEditor,
    TreeView,
    editor: require('vue2-ace-editor'),
  },
  ...mapState(['token']),
}
</script>

<style lang="sass">
.contentContainer > div
  display : flex

#courseModificationContainer 
  display: flex;
  flex-direction: row;
  width: 65%;

   
#courseModificationContainer > div
  margin: 0px 10px;
  width:calc(100% / 3 - 20px)
  width: 90%;

#courseModificationContainer > div > textarea
  width: 100%;
  height: 250px

#course-tree-view
  // float: left
  clear:both

#course-step-editor
  float: left
  margin-left: 20px

#course-tree-view
  margin: 0
  padding: 0
  list-style-type: none
  ol
    margin: 0
    padding: 0
    list-style-type: none
  li
    margin: 0px
  a
    text-decoration: none
  .glyphicon
    color: #2A6698
  .node-control
    display: inline-block
    width: 25px
    padding: 0 5px
    text-align: center

</style>
