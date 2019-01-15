<template lang="pug">
#course-creator.panel.panel-default
  .panel-heading données d'étape
  .panel-body
    .form-group
      label(for='name') nom :
      input#name.form-control(type='text'
      name='name'
      v-model='node.data.name'
      :disabled='!node.editable'
    )
    .form-group
      label(for='link') lien :
      input#link.form-control(
        type='text'
        name='link'
        v-model='node.data.link'
        :disabled='!node.editable'
      )
    button.btn.btn-success(
      type='button'
      @click='save'
      :disabled='!node.editable'
      ) enregistrer
    button.btn.btn-success(
      type='button'
      @click='createChild'
    ) ajouter étape enfant
    button.btn.btn-danger(
        type='button'
        @click='remove'
        :disabled='!node.editable'
      ) supprimer
</template>

<script>
export default {
  props: [
    'node'
  ],
  watch: {
    'node.data.name' () {
      if (this.node.editable) {
        this.node.name = this.node.data.name
      }
    }
  },
  methods: {
    createChild () {
      this.$emit('create-child', this.node)
    },
    save () {
      this.$emit('save', this.node)
    },
    remove () {
      this.$emit('remove', this.node)
    }
  }
}
</script>
