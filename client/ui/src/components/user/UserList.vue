<template lang="pug">
div
  h3 Liste des utilisateurs
  input.form-control(
    v-model='search'
    type='text'
    placeholder='Rechercher'
  )
  table.table.table-condensed.table-hover
    thead
      tr
        th #
        th nom d'utilisateur
    tbody
      tr(v-for='user in users')
        td {{user.id}}
        td
          router-link(:to="'/users/' + user.id")
            | {{user.username}}
  .text-center
    ul.pagination
      li(:class='{disabled: currentPage === 1}')
        a(@click='loadPage(currentPage - 1)') &laquo; Précédent
      li(v-for='page in pages', :class='{active: page === currentPage}')
        a(@click='loadPage(page)', v-if="page") {{page}}
      li(:class='{disabled: currentPage === lastPage}')
        a(@click='loadPage(currentPage + 1)') Suivant &raquo;
</template>

<script>
import _ from 'lodash'

import Api from '@/api'

export default {
  data () {
    return {
      users: [],
      search: '',
      currentPage: null,
      lastPage: null,
      previousPageUrl: null,
      nextPageUrl: null
    }
  },
  computed: {
    pages () {
      let minimum = Math.max(1, this.currentPage - 5)
      let maximum = Math.min(this.lastPage + 1, this.currentPage + 5)
      return _.range(minimum, maximum)
    }
  },
  async created () {
    this.filterByName = _.debounce(() => this.loadPage(), 500)
    this.loadPage(1)
  },
  watch: {
    search () {
      this.filterByName()
    }
  },
  methods: {
    async loadPage (page) {
      if (page < 1 || (this.lastPage && page > this.lastPage)) {
        return
      }
      let result = await Api.getUsersByPage(page, this.search)
      this.users = result.items
      this.currentPage = result.currentPage
      this.lastPage = result.lastPage
    }
  }
}
</script>

<style lang="sass" scoped>
a
  cursor: pointer
li
  cursor: pointer
</style>
