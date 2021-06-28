<template lang="pug">
b-nav-form.b-search(:class='{ closed: searchClosed }')
  b-form-input.search-text.border-0(
    size='sm',
    @focus='focusInput',
    @blur='searchClosed = true',
    @keyup.esc='leaveSearch',
    v-model='searchQuery',
    type='search',
    :class='{ closed: searchClosed }',
    :placeholder='!searchClosed ? "Entrer votre recherche" : ""'
  )
  b-button.search-icon.mr-2.mr-md-0.p-0.border-0.rounded-circle.fa(
    type='submit',
    @click.prevent='isLoading = true',
    :class='isLoading ? "fa-spinner" : "fa-search"'
  ) 
</template>

<script>
export default {
  data() {
    return {
      searchClosed: true,
      isLoading: false,
      searchQuery: '',
    }
  },
  methods: {
    focusInput(event) {
      this.searchClosed = false
      const inputTextLength = event.target.value.length
      event.target.selectionStart = inputTextLength
    },
    leaveSearch(event) {
      event.target.blur()
      this.isLoading = false
      this.searchQuery = ''
      this.searchClosed = true
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

$buttonSize: 2rem;

.search-icon {
  width: 2rem !important;
  background-color: var(--indigo);
}
.search-text {
  order: 1;
}
.search-text,
.search-icon {
  height: 2rem !important;
}
@media only screen and (min-width: 768px) {
}

@media only screen and (min-width: 768px) {
  .search-text:focus + .fa-search {
    transform: rotate(360deg);
  }

  .search-text + .fa-search {
    transform: rotate(0);
    transition: transform 0.5s;
  }

  input.search-text.closed {
    height: $buttonSize;
    width: $buttonSize !important;
    background-color: transparent !important;
  }

  input.search-text {
    background-color: var(--white) !important;
    width: 238px !important;
    transition: background-color 0.5s, width 0.5s;
    border-radius: 150px !important;
  }

  input + button.search-icon {
    width: $buttonSize;
    height: $buttonSize;
    line-height: $buttonSize;
    pointer-events: none;
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
  }
  .b-search form {
    position: relative;
  }
}
.b-search .fa-spinner {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
