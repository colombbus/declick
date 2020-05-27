<template lang="pug">
div.main-menu(:class='stateClass' ref='menu')
  button.main-menu__open(type='button' @click='open')
  button.main-menu__close(type='button' @click='close')
  ul.main-menu__list
    li.main-menu__item: router-link.main-menu__link.main-menu__home(to='/') {{ $t('menu.homepage') }}
    li.main-menu__item: router-link.main-menu__link(to='/progress') {{ $t('menu.learn') }}
    li.main-menu__item: router-link.main-menu__link(to='/create') {{ $t('menu.create') }}
    li.main-menu__item: router-link.main-menu__link(to='/explore') {{ $t('menu.play') }}
    //- li.main-menu__item: router-link.main-menu__link(to='/resources') {{ $t('menu.resources') }}
    //- li.main-menu__item: router-link.main-menu__link(to='/contact') {{ $t('menu.contact') }}
    li.main-menu__item
      a.main-menu__link.connectionLink(
        v-if="!user"
        @click='isAuthenticationModalVisible = true'
        class='illustrated-link log-in-link') {{ $t('menu.login') }}
      a.main-menu__link.connectionLink(
        v-else
        @click='logOut') {{ $t('menu.logout') }}
    //- li.main-menu__item(v-if="user && user.isAdmin"): router-link.main-menu__link(to='/administration') {{ $t('menu.administration') }}
    li.main-menu__item(v-if="user"): router-link.main-menu__link(:to='getUserIDLink') {{ $t('menu.my-account') }}
  authentication-modal(
    @close='isAuthenticationModalVisible = false'
    v-if='isAuthenticationModalVisible'
  )
</template>

<script>
import AuthenticationModal from '../user/AuthenticationModal'
import { mapState, mapActions } from 'vuex'
import config from '../../config'

export default {
  data() {
    return {
      // user: this.$store.state.user,
      // logOut: false,
      isAuthenticationModalVisible: false,
      opened: false,
      sticky: false,
      onScroll: null,
    }
  },
  mounted() {
    const menuY = this.$refs.menu.offsetTop
    this.onScroll = () => {
      if (document.body.scrollTop > menuY) {
        this.sticky = true
      } else {
        this.sticky = false
      }
    }
    this.onScroll()
    document.body.addEventListener('scroll', this.onScroll)
  },
  computed: {
    getUserIDLink() {
      return '/users/' + this.$store.state.user.id
    },
    user_id() {
      return this.userID
    },
    forumLink() {
      return config.forumUrl
    },
    stateClass() {
      return {
        'main-menu--opened': this.opened,
        'main-menu--closed': !this.opened,
        'main-menu--sticky': this.sticky,
      }
    },
    ...mapState(['user']),
  },
  methods: {
    open() {
      this.opened = true
    },
    close() {
      this.opened = false
    },
    ...mapActions(['logOut']),
  },
  components: {
    AuthenticationModal,
  },
}
</script>

<style lang="scss">
@import '~@/assets/styles/globals';

.main-menu__list {
  position: relative;
  width: 100%;
  z-index: 500;
  display: flex;
  margin: 0;
  padding: 0;
  border-top: 7px solid #6e3a51;
  justify-content: center;
  background-color: #652e46;
  background-image: url(../../assets/images/wave.svg);
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.25);
  text-transform: uppercase;
}

.main-menu__item {
  display: inline-block;
  cursor: pointer;
}

.main-menu__link {
  padding: 7px 20px;
  display: inline-block;

  &:hover {
    background-color: #fff1;
  }
}

.main-menu__contact,
.main-menu__home {
  display: none;
}

.main-menu .main-menu__link {
  font-size: 11pt;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.main-menu__open,
.main-menu__close {
  display: none;
}

.main-menu__close {
  @extend .fa;

  @extend .fa-2x;

  @extend .fa-times;

  position: absolute;
  top: 10px;
  left: 0;
  padding: 13px;
  border: none;
  border-radius: 0 10px 10px 0;
  background: transparent;
  color: white;
  z-index: 2;
  outline: 0;
}

.main-menu__open {
  @extend .fa;

  @extend .fa-2x;

  @extend .fa-bars;

  position: absolute;
  top: 10px;
  left: 0;
  padding: 13px;
  border: none;
  border-radius: 0 10px 10px 0;
  color: white;
  background-color: #652e46;
  z-index: 2;
  outline: 0;
}

.main-menu--sticky {
  position: absolute;
  top: 0;
  width: 100%;
}

// small devices

@media only screen and (max-width: 576px) {
  .main-menu {
    position: absolute;
    top: 0;
    left: 0;
  }

  .main-menu--closed .main-menu__list {
    display: none;
  }

  .main-menu--closed .main-menu__open {
    display: block;
  }

  .main-menu--opened .main-menu__close {
    display: block;
  }

  .main-menu__list {
    padding: 10px;
    padding-top: 55px;
    flex-direction: column;
    background-image: none;
    align-items: left;
    z-index: 1;
  }

  .main-menu .main-menu__item {
    margin-left: 0;

    &:not(:last-child) {
      border-bottom: 1px solid white;
    }
  }

  .main-menu__contact,
  .main-menu__home {
    display: block;
  }
}
</style>
