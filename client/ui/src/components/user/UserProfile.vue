<template lang="pug">
div
  div(v-if='user')
    h3
      | Utilisateurs > {{user.username}}
    .panel.panel-default
      dl
        dt email
        dd {{user.email}}
    button.btn.btn-default(
      @click="editUser"
      type='button'
    ) modifier les informations
</template>

<script>
import Api from 'src/api'

export default {
  props: ['id'],
  data () {
    return {
      user: null
    }
  },
  async created () {
    this.user = await Api.getUser(this.id)
  },
  methods: {
    editUser () {
      this.$router.push({path: '/users/' + this.user.id + '/edit'})
    }
  }
}
</script>

<style lang="sass" scoped>
.panel
  padding-top: 20px

dt
  display: inline-block
  padding: 5px
  width: 25%
  font-weight: bold
  text-align: right

dd
  display: inline-block
  width: 75%
  padding: 5px
</style>
