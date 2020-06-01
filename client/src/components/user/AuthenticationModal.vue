<template lang="pug">
transition(name='modal')
  .mask(@click="$emit('close')")
    .wrapper
      .container(@click.stop='')
        div(v-show="mode === 'connection'")
          .form-group.has-error(v-if='error')
            .help-block
             | Nom d'utilisateur ou mot de passe incorrect
          .form-group.has-feedback
            .input-group
              .input-group-addon: i.fa.fa-user
              input(
                @keyup.enter='logIn'
                v-model='username'
                type='text'
                class='form-control'
                placeholder="nom d'utilisateur"
              )
          .form-group
            .input-group
              .input-group-addon: i.fa.fa-lock
              input(
                @keyup.enter='logIn'
                v-model='password'
                type='password'
                class='form-control'
                placeholder='mot de passe'
              )
          .form-group
            .input-group.validation
              button(
                @click='logIn',
                :disabled='isLogingIn'
                type='button'
                class='btn btn-block btn-primary'
              )
                | se connecter
                span(v-show='isLogingIn')
                  | &nbsp;
                  span.fa.fa-circle-o-notch.fa-spin
              button(
                @click="mode = 'registration'"
                type='button'
                class='btn btn-block btn-link'
              ) s'inscrire
        registration-form(
          @switch-to-connection="mode = 'connection'"
          @close="$emit('close')"
          v-show="mode === 'registration'"
        )
</template>

<script>
import '@fortawesome/fontawesome-free/css/fontawesome.css'

import RegistrationForm from './RegistrationForm'

export default {
  data() {
    return {
      mode: 'connection',
      isLogingIn: false,
      username: '',
      password: '',
      error: null,
    }
  },
  methods: {
    async logIn() {
      this.isLogingIn = true
      try {
        await this.$store.dispatch('logIn', {
          username: this.username,
          password: this.password,
        })
        this.$emit('close')
      } catch (e) {
        // this.error = e.body.errors
      } finally {
        this.isLogingIn = false
      }
    },
  },
  components: {
    RegistrationForm,
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  display: table;
  transition: opacity 0.3s ease;
  font-family: 'Arial', sans-serif;

  .wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .container {
    width: 300px;
    // height: 210px;
    margin: 0 auto;
    padding: $size-3;
    box-sizing: border-box;
    background-color: $white;
    box-shadow: 0 $size-1 $size-2 #00000054;
    transition: all 0.3s ease;
  }

  .modal-enter,
  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .container,
  .modal-leave-active .container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  .form-control {
    color: white;
    width: 100%;
    &:focus {
      border-color: $valid-color;
      outline: 0;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
        0 0 8px rgba(102, 175, 233, 0.6);
    }
  }
  .input-group {
    display: flex;
    align-items: center;
    margin-bottom: $size-2;
    height: $size-4;

    .fa {
      padding: $size-3;
      background-color: $wine-berry;
      color: $white;
      border-radius: $size-1 0 0 $size-1;
      font-size: 0.7em;
      display: flex;
      align-items: center;
    }
    input {
      border-radius: 0 $size-1 $size-1 0;
      border: 0;
      background-color: $white;
      background-image: none;
      color: $cab-sav;
      border: $cab-sav solid 1px;
      padding-left: $size-2;
      font-family: 'Arial', sans-serif;
    }

    .fa,
    input {
      box-sizing: border-box;
      height: $size-4;
    }
  }
  .input-group.validation {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 0;
    button:last-child {
      margin-right: 0;
    }
  }
}
</style>
