<template>
  <ol>
    <span
      @click="selectNode"
      class="list-group-item"
      :style="`padding-left: ${depth * 20}px`"
    >
      <span class="node-control">
        <span
          v-show="node.children.length > 0 && !open"
          @click="openChildren"
          class="glyphicon glyphicon-plus"
        ></span>
        <span
          v-show="node.children.length > 0 && open"
          @click="closeChildren"
          class="glyphicon glyphicon-minus"
        ></span>
      </span><!-- no space fix
      --><a>{{ node.name }}</a>
    </span>
    <transition name="fade">
      <li
        v-show="node.children.length > 0 && open"
        class="tree-view-children"
      >
        <step-tree-item
          v-for="child in node.children"
          :depth="depth + 1"
          :node="child"
          @select-node="transmitEvent"
        ></step-tree-item>
      </li>
    </transition>
  </ol>
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

<style>
.tree-view-children {
  margin-left: 20px;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
