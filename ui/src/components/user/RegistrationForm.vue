<template lang="pug">
div
  .form-group.has-feedback(:class="{'has-error': errors.username}")
    .input-group
      .input-group-addon: span.glyphicon.glyphicon-user
      input(
        @keyup.enter='logIn'
        v-model='username'
        type='text'
        class='form-control'
        placeholder="nom d'utilisateur"
      )
    span.help-block(v-if='errors.username')
      | {{errors.username[0]}}
  .form-group.has-feedback(:class="{'has-error': errors.email}")
    .input-group
      .input-group-addon: span.glyphicon.glyphicon-envelope
      input(
        @keyup.enter='register'
        v-model='email'
        type='text'
        class='form-control'
        placeholder="email (optionnel)"
      )
    span.help-block(v-if='errors.email')
      | {{errors.email[0]}}
  .form-group.has-feedback(:class="{'has-error': errors.password}")
    .input-group
      .input-group-addon: span.glyphicon.glyphicon-lock
      input(
        @keyup.enter='register'
        v-model='password'
        type='password'
        class='form-control'
        placeholder='mot de passe'
      )
    span.help-block(v-if='errors.password')
      | {{errors.password[0]}}
  .form-group.has-feedback(:class="{'has-error': errors.passwordConfirmation}")
    .input-group
      .input-group-addon: span.glyphicon.glyphicon-lock
      input(
        @keyup.enter='register'
        v-model='passwordConfirmation'
        type='password'
        class='form-control'
        placeholder='confirmation mot de passe'
      )
    span.help-block(v-if='errors.passwordConfirmation')
      |  {{errors.passwordConfirmation[0]}}
  button(
    @click='register'
    type='button'
    class='btn btn-block btn-primary'
  ) valider l'inscription
  span.help-block(v-if='errors.server')
    | {{errors.server[0]}}
  button(
    @click="$emit('switch-to-connection')"
    type='button'
    class='btn btn-block btn-link'
  ) retourner à la connexion
</template>

<script>
import Vue from 'vue'
import config from '@/config'

export default {
  data () {
    return {
      username: '',
      email: '',
      password: '',
      errors: {
        username: null,
        email: null,
        password: null,
        passwordConfirmation: null
      },
      passwordConfirmation: '',
      lastUsernameTest: 0
    }
  },
  watch: {
    username (value) {
      this.errors.username = null
      if (this.checkTimeout) {
        window.clearTimeout(this.checkTimeout)
      }
      this.checkTimeout = window.setTimeout(async () => {
        let endpoint = `${config.apiUrl}v1/test/username`
        let {body: response} = await Vue.http.post(endpoint, {username: this.username})
        if (response.result === false) {
          this.errors.username = ["Ce nom d'utilisateur est déjà pris."]
        }
      }, 500)
    },
    password () {
      this.errors.password = null
      this.comparePasswords()
    },
    passwordConfirmation () {
      this.errors.passwordConfirmation = null
      this.comparePasswords()
    },
    email () {
      this.errors.email = null
    }
  },
  methods: {
    async register () {
      this.errors.server = null
      try {
        if (!this.password || this.password.trim().length === 0) {
          let error = {body: {password: ["Mot de passe vide"]}}
          throw error
        }
        if (!this.errors.username && !this.errors.password && !this.errors.passwordConfirmation && !this.errors.email) {
          var data = {
            username: this.username,
            password: this.password
          }
          if (this.email.trim().length > 0) {
            data.email = this.email
          }
          await this.$store.dispatch('register', data)
          await this.$store.dispatch('logIn', {
            username: this.username,
            password: this.password
          })
          this.$emit('close')
        }
      } catch (e) {
        if (e.body) {
          for (var field in e.body) {
            this.errors[field] = e.body[field]
          }
        } else {
          this.errors.server = ["Erreur du serveur"]
        }
      }
    },
    comparePasswords () {
      if ((this.password && this.password.trim().length > 0) || (this.passwordConfirmation && this.passwordConfirmation.trim().length > 0)) {
        if (this.password === this.passwordConfirmation) {
          return true
        } else {
          this.errors.passwordConfirmation = ["Les mots de passe ne correspondent pas"]
        }
      }
      return false
    }
  },
  checkTimeout: false
}
</script>

<style lang="sass" scoped>
.input-group
  margin-bottom: 6px
</style>
