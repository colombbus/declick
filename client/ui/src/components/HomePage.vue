<template lang="pug">
.home
  .covid-wrapper(v-show="isPopupShown" @click="isPopupShown = false")
    .covid-container
      input(type='button', value='ok !')
  .home__presentation.home__covid
    a(href="https://declick.net/ressource/challenge-gestes.html" target="_blank")
      img.instaBannier(src="../assets/images/covid/covid-banniere.png")
    .home__covid-wrapper
      a(href="https://www.sap.com/france/about/social-responsibility.html" target="_blank")
        img.instaBannier(src="../assets/images/covid/fondation_sap.jpg")
      a(href="https://colombbus.org" target="_blank")
        img.instaBannier(src="../assets/images/covid/colombbus.png")
    p La Fondation SAP France et l'association Colombbus sont heureuses de vous convier à leur challenge 
    | « Codez pour faire la différence #GestesBarrières ! »
    p 
      | Devenez acteur de 
      b la lutte contre le Covid-19 à travers les gestes barrières 
      | en créant un jeu grâce à 
      a(href="//declick.net") declick.net 
      | autour de ce thème fort.
    p 
      a(href="//www.croix-rouge.fr/" style="float: left" target="_blank")
        img(src="../assets/images/covid/croix_rouge.png" height="90")
      | Pas de palmarès de meilleurs projets, mais pour 
      b chaque projet reçu, la Fondation SAP France réalisera un don de 20€ à la Croix Rouge Française. Un certificat de participation et de don à votre nom vous sera envoyé, comme remerciement.
    p Vous souhaitez relever le Challenge ? Ci-dessous les grandes étapes !
    a(href="https://declick.net/ressource/challenge-gestes.html" target="_blank")
      img.instaBannier(src="../assets/images/covid/covid-etape-sap.png")
    a(class="covid-action" href="https://declick.net/ressource/challenge-gestes.html" target="_blank")
      | cliquer ici pour participer
  hr.home__separation
  .home__presentation
    h1 Declick est un outil clé en main !
    p.
      En classe, en atelier ou à la maison, il permet d'aborder les bases du
      code informatique et de les appliquer à travers des projets, individuels
      ou collectifs, d'applications ou de jeux vidéo.
    a(href="https://www.instagram.com/associationcolombbus/" target="_blank")
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
export default {
  data() {
    return {
      isPopupShown: true
    };
  }
};
</script>

<style lang="sass">
@import '../styles/mixins'

$crimson: #e32c20
$cab-sav: #480a2a
$red-violet: #de1580
$white: #fff
$wine-berry: #531937
$robot-skin: #cf2730

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
  z-index: -1

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
.home__covid
  font-size: 10pt
  text-align: left
  &-wrapper
    display: flex
    justify-content: center
    img
      width: 120px
      margin-right: 30px
  a
    color: $robot-skin
  .covid-action
    display: block
    background-color: $cab-sav
    color: white
    padding: 7px
    font-size: 14pt
    border-radius: 4px
    margin: 0 auto
    width: 220px
    text-decoration: none
    &:hover
    &:focus
      color: white
hr.home__separation
  width: 100px
  background-color: $robot-skin
  height: 1px
  margin: 0 auto
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

.covid-wrapper
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  background-color: #000000aa
  margin-bottom: 0

.covid-container
  width: 560px
  height: 320px
  background-image: url(../assets/images/covid/popup.png)
  position: relative
  margin-right: auto
  margin-left: auto
  transform: translateY(50%)
  input
    background-color: #00000000
    border: 1px solid white
    color: white
    position: absolute
    bottom: 17px
    right: 20px
    width: 104px
    height: 50px
    font-size: 40px
    text-transform: uppercase


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
