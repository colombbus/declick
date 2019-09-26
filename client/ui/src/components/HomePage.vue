<template lang="pug">
.home
  .home__presentation
    h1 Declick est un outil clé en main !
    p.
      En classe, en atelier ou à la maison, il permet d'aborder les bases du
      code informatique et de les appliquer à travers des projets, individuels
      ou collectifs, d'applications ou de jeux vidéo.
    img.instaBannier(src="../assets/instaBannier.png")
  .home__box
    img.home__robot-train(src='../assets/images/figures/robot-train.svg' alt="robot logo declick")
    h3 les parcours
    p.
      La section « APPRENDRE » regroupe des parcours qui vous permettent
      d'assimiler progressivement des notions de programmation.
  .home__box
    img.home__robot-idea(src='../assets/images/figures/robot-idea.svg' alt="robot logo declick")
    h3 l'espace créatif
    p.
      La section « CRÉER » vous propose un environnement de travail où vous
      pouvez composer avec les notions acquises pour créer vos propres jeux et
      applications.
  .home__box
    img.home__robot-observe(src='../assets/images/figures/robot-observe.svg' alt="robot logo declick")
    h3 l'espace découverte
    p.
      Dans la section « JOUER » retrouvez et testez les jeux ou les
      applications créés par la communauté Declick.
  h2 declick en vidéo
  .home__video: iframe(
    src='https://player.vimeo.com/video/211507001?title=0&byline=0&portrait=0'
    frameborder='0'
    webkitallowfullscreen
    mozallowfullscreen
    allowfullscreen
    alt="video presentation declick"
  )
  h2 notre approche
  .home__box
    img(src='../assets/images/figures/target.svg')
    h3 notre mission
    p.
      Declick a été conçu pour initier les 8-15 ans au code et à la création
      numérique, à travers la programmation écrite. La plateforme constitue
      ainsi une étape intermédiaire entre les éditeurs visuels (type Scratch)
      et les vrais environnements de programmation.
  .home__box
    img(src='../assets/images/figures/chart.svg')
    h3 notre pédagogie
    p.
      Declick est le fruit de plus de 10 ans d'expérience de l'enseignement de
      la programmation auprès des jeunes, notamment en zone d'éduction
      prioritaire : la plateforme est utilisée quotidiennement pour l'animation
      d'ateliers dans les collèges les écoles élémentaires et les centres
      d'animation.
  .home__box
    img(src='../assets/images/logos/Octocat.svg')
    h3 un logiciel libre
    p.
      Declick est gratuit et libre : le code source de la plateforme est
      hébergé sur GitHub et diffusé sous license GPL 3.0. Si vous voulez
      contribuer au développement, n'hésitez pas à nous contacter !
    img.home__tag(src='../assets/images/figures/made-in-France.svg')
  .home__about-us
    h3 l'association Colombbus
    p.
      Depuis 18 ans nous agissons pour l'éducation la formation, l'insertion
      sociale et professionnelle grâce à l'informatique et à internet. À
      travers nos activités nous facilitons l'usage et l'appropriation des
      outils numériques qui deviennent alors vecteurs d'inclusion, de
      développement personnel et de lien social.
    a(href='https://www.colombbus.org/' target='_blank') en savoir plus
  .home__partners
    h3 nos partenaires éducatifs
    .home__logo-group
      a(
        href='https://pixees.fr/classcode-v2/'
        title="Class'Code"
        target='_blank'
      ): img(src='../assets/images/logos/ClassCode.svg')
      a(
        href='https://d-clicsnumeriques.org/'
        title='D-Clics Numériques'
        target='_blank'
      ): img(src='../assets/images/logos/D-Clics-Numeriques.svg')
      a(
        href='https://www.reseau-canope.fr/'
        title='Réseau Canopé'
        target='_blank'
      ): img(src='../assets/images/logos/Canope.svg')
      a(
        href='http://www.ensiie.fr/'
        title='ENSIIE'
        target='_blank'
      ): img(src='../assets/images/logos/ENSIIE.svg')
      a(
        href='http://www.france-ioi.org/'
        title='France-IOI'
        target='_blank'
      ): img(src='../assets/images/logos/France-IOI.svg')
    h3 nos partenaires publics
    .home__logo-group
      a(
        href='http://www.education.gouv.fr/'
        title="Ministère de l'Éducation nationale"
        target='_blank'
      ): img(src='../assets/images/logos/Ministere-Education-nationale.svg')
      a(
        href='http://www.europe-en-france.gouv.fr/'
        title="L'Europe s'engage"
        target='_blank'
      ): img(src='../assets/images/logos/lEurope-sengage.svg')
      a(
        href='https://www.paris.fr/'
        title='Mairie de Paris'
        target='_blank'
      ): img(src='../assets/images/logos/Mairie-de-Paris.svg')
    h3 nos mécènes
    .home__logo-group
      a(
        href='https://www.vivendi.com/create-joy-fr/'
        title='Vivendi Create Joy'
        target='_blank'
      ): img(src='../assets/images/logos/Vivendi-Create-Joy.svg')
      a(
        href='https://www.thalesgroup.com/fr'
        title='Thales'
        target='_blank'
      ): img(src='../assets/images/logos/Thales.svg')
      a(
        href='https://www.fondation-sncf.org/fr/'
        title='Fondation SNCF'
        target='_blank'
      ): img(src='../assets/images/logos/Fondation-SNCF.svg')
      a(
        href='https://www.sap.com/france/index.html'
        title='SAP'
        target='_blank'
      ): img(src='../assets/images/logos/SAP_grad_R_pref.svg')
</template>

<script>
// export default {
//   metaInfo: {
//     // Children can override the title.
//     title: 'Bienvenus sur declick',
//     // Result: My Page Title ← My Site
//     // If a child changes the title to "My Other Page Title",
//     // it will become: My Other Page Title ← My Site
//     titleTemplate: 'declick - Colombbus',
//     // Define meta tags here.
//     meta: [
//       {'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8'},
//       {name: 'viewport', content: 'width=device-width, initial-scale=1'},
//       {vmid: 'description', name: 'description', content: 'Bienvenus sur declick'},
//     ]
//   }
// }
</script>

<style lang="sass">
@import '../styles/mixins'

$crimson: #e32c20
$cab-sav: #480a2a
$red-violet: #de1580
$white: #fff
$wine-berry: #531937

$vertical-gap: 40px

@mixin postline($color)
  &:after
    content: ''
    display: block
    width: 100px
    margin: auto
    margin-top: 7px
    margin-bottom: 12px
    border-bottom: 1px solid #{$color}

.home
  display: grid
  max-width: 992px
  margin: auto
  padding: #{$vertical-gap} 15px 0 15px
  grid-template-columns: repeat(12, 1fr)
  grid-column-gap: 30px
  text-align: center
  color: $wine-berry

.home > *
  grid-column: 1 / -1
  margin-bottom: $vertical-gap

.home__box
  position: relative
  grid-column: span 4

.home h2,
.home h3
  text-transform: uppercase
  letter-spacing: 2px

.home h2
  @include postline($crimson)
  font-size: 16pt
  font-weight: bold
  margin-bottom: 25px

.home__box > h3
  @include postline($crimson)
  font-weight: bold
  color: $crimson

.home h3
  font-weight: bold
  font-size: 12pt

.home h4, .home h1
  margin-bottom: 5px
  font-size: 12pt
  font-weight: bold

.home__presentation
  width: 66%
  margin-left: auto
  margin-right: auto
  &, h4, h1
    font-size: 14pt

.home__box > img
  height: 50px

.home__box .home__robot-train,
.home__box .home__robot-idea
  height: 80px

.home__box .home__robot-observe
  margin-top: 30px

.home .home__tag
  position: absolute
  bottom: 0
  right: 0
  display: block
  width: 75px
  height: 75px

.home__video
  +ratio-container(16, 9)

.home__about-us
  +full-width-background($red-violet)
  width: 66%
  margin-left: auto
  margin-right: auto
  margin-bottom: 0
  padding: #{$vertical-gap} 0
  color: $white
  & > :first-child
    margin-top: 0
  h3
    @include postline($white)
    font-weight: inherit
  p
    margin-bottom: 20px
  & > a
    padding: 5px
    border: 1px solid $white
    font-size: 8pt
    color: inherit
    text-decoration: none
    text-transform: uppercase

.home__partners
  +full-width-background($cab-sav)
  display: grid
  margin-bottom: 0
  padding: #{$vertical-gap} 0
  grid-template-columns: repeat(3, 1fr)
  grid-template-rows: auto 1fr
  grid-auto-flow: column
  grid-row-gap: 20px
  color: $white

.home__partners > *:nth-child(2n + 4)
  border-left: 1px solid white

.home__logo-group
  display: flex
  flex-wrap: wrap
  justify-content: center
  align-items: center

.home__logo-group a
  margin: 5px

.home__logo-group img
  height: 75px
  width: 90px

// small devices

@media only screen and (max-width: 576px)
  .home
    text-align: justify
  .home__presentation,
  .home__about-us
    width: 100%
  .home__box
    grid-column: span 12
    & > img,
    & > h3
      display: inline-block
      margin: 0
      vertical-align: baseline
    & > img
      position: relative
      top: 4px
      height: 20px
      margin-right: 11px
  .home h2:after,
  .home h3:after
    margin-left: 0
  .home__box .home__robot-train,
  .home__box .home__robot-idea
    height: 35px
  .home__box .home__robot-observe
    height: 23px
    margin-top: 0
  .home__box p
    margin-top: 3px
  .home__box .home__tag
    display: none
  .home__partners
    grid-template-columns: 1fr
    grid-template-rows: repeat(6, auto)
  .home__partners > *:nth-child(2n + 4)
    border-left: 0
  .home__partners h3
    margin-top: 20px
  .home__logo-group
    justify-content: left

.instaBannier
  width: 100%
  margin: 15px auto

@media only screen and (max-width: 376px)
  .home
    display: block
</style>
