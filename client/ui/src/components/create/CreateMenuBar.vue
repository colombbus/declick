<template lang="pug">
.self
  .dropdown(v-show='user')
    a.dropdown-trigger(type='button' data-toggle='dropdown')
    ul.dropdown-menu
      li: a(@click="$emit('showView', {view: 'ProjectDetails', params: {project: currentProject}})") informations
      li.divider(role='separator')
      li: a(@click="$emit('showView', 'ProjectList')") projets
      template(v-if='user')
        li.divider(role='separator')
        li.styleLikeLink Importer des exemples de programmes :
        li: a(@click='importExamplePrograms(402)') Les bases - inspirées de Bob&Max 
          span.difficulty.easy
            i.far.fa-star
        li: a(@click='importExamplePrograms(5692)') Plateforme - Level 1 2 3 
          span.difficulty.medium
            i.far.fa-star
            i.far.fa-star
        li: a(@click='importExamplePrograms(6959)') DinoRun 
          span.difficulty.medium 
            i.far.fa-star
            i.far.fa-star
        li: a(@click='importExamplePrograms(6895)') Pong 
          span.difficulty.hard
            i.far.fa-star
            i.far.fa-star
            i.far.fa-star
        li: a(@click='importExamplePrograms(5833)') Runner - GothicVania 
          span.difficulty.hard
            i.far.fa-star
            i.far.fa-star
            i.far.fa-star
  span.project-name {{(currentProject && currentProject.name) || 'Projet'}}
  a(
    @click='toggleMode',
    :class="editor ? 'show-view-link' : 'show-editor-link'"
  )
  router-link(
    to="/draw"
    class="show-maze-editor-link"
    title="designer de niveau - beta"
  )
</template>

<script>
import {mapState} from 'vuex'
import Api from 'src/api'

export default {
  props: ['editor'],
  methods: {
    importExamplePrograms (id) {

      // TODO: le faire autrement

      if(confirm("Attention, l'import va ajouter plusieurs programmes et médias dans le projet :" + this.currentProject.name)){
        Api.importProject(id, this.token)
      }
      // window.alert('Les programmes ont été importés, veuillez recharger la page.')
    },
    toggleMode () {
      this.$emit('toggleEditor')
    }
  },
  computed: mapState(['token', 'user', 'currentProject'])
}
</script>

<style lang="sass" scoped>
a
  cursor: pointer

.self
  height: 50px
  padding: 0 5px
  line-height: 50px

.dropdown
  display: inline-block

.dropdown-trigger
  display: inline-block
  width: 21px
  height: 50px
  background-image: url(~assets/image/dropdown-trigger.png)
  background-repeat: no-repeat
  background-position: center
  vertical-align: bottom
  cursor: pointer

.project-name
  display: inline-block
  margin-left: 10px
  font-family: "Rubik", sans-serif
  font-size: 20pt
  font-weight: 700
  color: #480A2A
  vertical-align: middle

.show-editor-link,
.show-maze-editor-link,
.show-view-link
  display: inline-block
  float: right
  width: 36px
  height: 36px
  margin-top: 5px
  cursor: pointer

.show-editor-link
  background-image: url(~assets/image/switch-editor.png)

.show-editor-link:hover
  background-image: url(~assets/image/switch-editor-hover.png)

.show-view-link
  background-image: url(~assets/image/switch-view.png)

.show-view-link:hover
  background-image: url(~assets/image/switch-view-hover.png)

.show-maze-editor-link:hover
  background-image: url(~assets/findPath.svg)
.show-maze-editor-link
  background-image: url(~assets/path.svg)
  height: 36px
  width: 36px
  margin: 5px
  border-radius: 50px


span.difficulty
  float: right

span.difficulty.easy i
  color: green

span.difficulty.hard i
  color: black


span.difficulty.medium i
  color: orange


.styleLikeLink  
  display: block;
  padding: 5px 20px;
  clear: both;
  font-weight: 400;
  line-height: 1.42857143;
  color: #333;
  white-space: nowrap;

</style>: 'show-maze-editor-link'
