<template lang="pug">
b-container.my-4
  h1 actualité du logiciel
  p.pb-2 la liste des publications concernant&nbsp;
    code declick
    b-button.float-right(variant="primary" @click='loadBlogEntries')
      b-icon-arrow-repeat
  .accordion(role='tablist', v-for='(article, index) in blogEntries')
    b-card.mb-2(no-body)
      b-card-header.p-1.d-flex.justify-content-between(
        header-tag='header'
        role='tab'
        block,
        v-b-toggle='[`accordion-${article.id}`]'
        :class='`accordion-${article.id}`'
        )
        span(v-html='article.subject')
        span
          | {{ timestampToDate(article.created) }}
      b-collapse(
        :id='`accordion-${article.id}`',
        :visible='index === 0',
        accordion='accordion',
        role='tabpanel'
        style='background-color: black'
      )
        b-card-body
          b-card-text(v-html='article.summary')
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      blogEntries: [],
    }
  },
  // computed:,
  methods: {
    timestampToDate(timestamp) {
      const date = new Date(timestamp * 1000)
      const dd_mm_yyyy = date.toLocaleDateString()
      return dd_mm_yyyy.replace(/(\d+)\/(\d+)\/(\d+)/g, '$3-$2-$1')
    },
    async loadBlogEntries() {
      this.blogEntries = []
      this.blogEntries = await this.getAllBlogEntries()
    },
    ...mapActions(['getAllBlogEntries']),
  },
  mounted() {
    this.loadBlogEntries()
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/mixins';
@import '~@/assets/styles/globals';
.not-collapsed {
  background-color: var(--gray);
  color: var(--light);
}
.not-collapsed:hover {
  // background-color: var(--dark-gray);
  color: var(--white);
}
</style>
