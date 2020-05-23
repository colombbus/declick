<template lang="pug">
div.user-profile
  div.container(v-if='user')
    h3
      | {{ $t('words.users') }}
      span.fa.fa-angle-right.breadcrumb-separator
      | {{ user.username }}
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
      tr
        td {{ $t('words.email') }}
        td 
          a.user-email(:href="'mailto:'+ user.email")
            | {{ user.email }}
      tr
        td {{ $t('words.token') }}
        td.token {{ token }}
      tr
        td {{ $t('words.uiVersion') }}
        td {{ uiVersion }}
    router-link.btn.btn-default(:to="'/users/' + user.id + '/edit'") {{ $t('words.edit')}}
    router-link.btn.btn-default(:to="'/users/' + user.id + '/projects'") {{ $t('words.my-projects')}}

</template>

<script>
import Api from '@/api'

export default {
  props: ['id'],
  data() {
    return {
      user: null,
      token: null,
      uiVersion: null,
    }
  },
  async created() {
    this.user = await Api.getUser(this.id)
    this.uiVersion = localStorage.getItem('ui.version')
    this.token = localStorage.getItem('ui.token')
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

div.user-profile {
  .tag {
    display: block;
  }

  .panel {
    padding-top: 20px;
  }

  .breadcrumb-separator {
    padding: 0 $padding-3;
  }

  table,
  tr {
    display: block;
  }

  table {
    margin-bottom: 10px;
  }

  td:first-child {
    display: inline-block;
    padding: 5px;
    width: 25%;
    font-weight: bold;
    text-align: right;
  }

  td:nth-child(2) {
    display: inline-block;
    padding: 5px;
  }

  .user-email {
    color: $cab-sav;
  }

  a.btn {
    margin-left: 7px;
  }

  .fa.fa-check {
    color: $valid-color;
  }

  .token {
    font-family: monospace;
  }
}
</style>
