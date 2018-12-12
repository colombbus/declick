<template lang="pug">
ol
  span.list-group-item(@click='selectNode' :style='`padding-left: ${depth * 20}px`')
    span.node-control
      span.glyphicon.glyphicon-plus(v-show='node.children.length > 0 && !open' @click='openChildren')
      span.glyphicon.glyphicon-minus(v-show='node.children.length > 0 && open' @click='closeChildren')
    // no space fix
    a {{ node.name }}
  transition(name='fade')
    li.tree-view-children(v-show='node.children.length > 0 && open')
      step-tree-item(v-for='child in node.children' :depth='depth + 1' :node='child' :key='node.data.id' @select-node='transmitEvent')
</template>

<script>
export default {
  name: 'StepTreeItem',
  props: {
    'depth': {
      default: 0
    },
    'node': {}
  },
  data: function () {
    return {
      open: true
    }
  },
  methods: {
    openChildren () {
      this.open = true
    },
    closeChildren () {
      this.open = false
    },
    selectNode () {
      this.transmitEvent(this.node)
    },
    transmitEvent (node) {
      this.$emit('select-node', node)
    }
  }
}
</script>

<style lang="sass">
.tree-view-children
  margin-left: 20px
  cursor: pointer

.fade-enter-active, .fade-leave-active
  transition: opacity 0.5s

.fade-enter, .fade-leave-active
  opacity: 0
</style>
