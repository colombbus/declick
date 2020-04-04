<template lang="pug">
div
  div(v-if='user')
    h3
      | Utilisateurs > {{user.username}}
    form
      .form-group
        label(for='user-edition-project-name')
          | email
        input#user-edition-project-name.form-control(
          v-model='user.email'
          type='text'
        )
      button.btn.btn-default(
        @click="showUserProfile"
        type='button'
      )
        | annuler
      | &nbsp;
      button.btn.btn-primary(@click='updateUser' type='button')
        | enregistrer les modifications
</template>

<script>
import Api from '@/api'

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
    async updateUser () {
      await Api.updateUser(
        this.user.id,
        {email: this.user.email},
        this.$store.state.token
      )
      this.showUserProfile()
    },
    showUserProfile () {
      this.$router.push({path: '/users/' + this.user.id})
    }
  }
}
</script>
