<template lang="pug">
div.container
  div(v-if='user')
    h3
      | {{ $t('words.users') }}
      span.fa.fa-angle-right.breadcrumb-separator
      | {{ user.username }}
    form
      table.panel.panel-default
        tr
          td {{ $t('words.id') }}
          td {{ user.id }}
        tr
          td {{ $t('words.username') }}
          td {{ user.username }}
        tr(v-if="user.isAdmin")
          td {{ $t('words.is-admin') }}
          td 
            span(:class="user.isAdmin ? 'fa fa-check' : ''" )
        tr
          td {{ $t('words.current-project-id') }}
          td 
            router-link.tag(:to="`/users/${user.id}/projects/${user.currentProjectId}`") {{ user.currentProjectId }}
        tr
          td {{ $t('words.default-project-id') }}
          td
            router-link.tag(:to="`/users/${user.id}/projects/${user.defaultProjectId}`") {{ user.defaultProjectId }}
        tr.form-group
          td
            label(for='user-edition-project-name')
            | {{ $t('words.email') }}
          td 
            input#user-edition-project-name.form-control(
              v-model='user.email'
              type='email'
            )
        tr.form-group
          td
            label(for='user-change-pwd')
            | {{ $t('words.password') }}
          td 
            input#user-change-pwd.form-control(
              v-model='password'
              type='password'
            )
            input#user-change-pwd2.form-control(
              type='password'
            )
        tr
          td {{ $t('words.token') }}
          td.token {{ token }}
      button.btn.btn-primary(@click='updateUser' type='button')
        | {{ $t('words.save')}}
      button.btn.btn-default(
        @click="showUser"
        type='button'
      )
        | {{ $t('words.cancel')}}
      | &nbsp;

</template>

<script>
import Api from '@/api'

export default {
  props: ['id'],
  data() {
    return {
      user: null,
      password: null,
      token: null,
    }
  },
  async created() {
    this.user = await Api.getUser(this.id)
    this.token = localStorage.getItem('ui.token')
  },
  methods: {
    async updateUser() {
      await Api.updateUser(
        this.user.id,
        { email: this.user.email },
        this.$store.state.token,
      )
      this.showUser()
    },
    showUser() {
      this.$router.push({ path: '/users/' + this.user.id })
    },
  },
}
</script>
