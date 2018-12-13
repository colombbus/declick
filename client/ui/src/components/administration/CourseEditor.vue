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
</template>

<script>
/* global $ */

import StepEditor from './StepEditor'
import TreeView from './TreeView'
import config from '@/config'

export default {
  data: function () {
    return {
      courseId: null,
      course: null,
      rootNode: null,
      selectedNode: null
    }
  },
  created () {
    this.courseId = this.$route.params.id
    this.retrieveCourse()
  },
  methods: {
    retrieveCourse () {
      $.ajax({
        method: 'GET',
        url: `${config.apiUrl}v1/circuits/${this.courseId}`,
        success: course => {
          this.course = course
          this.retrieveRootStep(this.course.root_node_id)
        }
      })
    },
    retrieveRootStep (stepId) {
      $.ajax({
        method: 'GET',
        url: `${config.apiUrl}v1/circuits/${this.courseId}/nodes/${stepId}`,
        success: rootStep => {
          this.rootNode = this.makeNode(rootStep)
          this.rootNode.name = 'nœud racine'
          this.rootNode.editable = false
          this.retrieveStepChildren(this.rootNode)
        }
      })
    },
    retrieveStepChildren (parentNode) {
      $.ajax({
        method: 'GET',
        url: `${config.apiUrl}v1` +
          `/circuits/${this.courseId}` +
          `/nodes/${parentNode.data.id}` +
          `/children`,
        success: childSteps => {
          for (let childStep of childSteps) {
            let childNode = this.makeNode(childStep)
            parentNode.children.push(childNode)
            this.retrieveStepChildren(childNode)
          }
        }
      })
    },
    createChildStep (parentNode) {
      let newStep = this.makeStep()
      newStep.parent_id = parentNode.data.id
      newStep.position = parentNode.children.length
      $.ajax({
        method: 'POST',
        url: `${config.apiUrl}v1/circuits/${this.courseId}/nodes`,
        data: newStep,
        success: createdStep => {
          let createdNode = this.makeNode(createdStep)
          parentNode.children.push(createdNode)
        }
      })
    },
    saveStep (node) {
      $.ajax({
        method: 'PATCH',
        url: `${config.apiUrl}v1/circuits/${this.courseId}/nodes/${node.data.id}`,
        data: node.data,
        success: step => {
          node.data = step
        }
      })
    },
    removeStep (node) {
      $.ajax({
        method: 'DELETE',
        url: `${config.apiUrl}v1/circuits/${this.courseId}/nodes/${node.data.id}`,
        success: () => {
          this.retrieveCourse()
        }
      })
    },
    makeStep () {
      return {
        name: 'nouveau nœud',
        url: null,
        parent_id: null,
        position: null
      }
    },
    makeNode (step) {
      if (!step) {
        step = this.makeStep()
      }
      return {
        name: step.name,
        children: [],
        data: step,
        editable: true
      }
    },
    selectNode (node) {
      this.selectedNode = node
    }
  },
  components: {
    StepEditor,
    TreeView
  }
}
</script>

<style lang="sass">
#course-tree-view
  float: left

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
