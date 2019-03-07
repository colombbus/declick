<template lang="html">
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <h2>Administration</h2>
          <ul class="adminNav">
            <li>
              <router-link
                to="/administration/users"
                class="content-link"
              >gestion des utilisateurs</router-link>
            </li>
            <li>
              <router-link
                to="/administration/courses"
                class="content-link"
              >gestion des parcours</router-link>
            </li>
          </ul>
        </div>
        <div class="col-md-9 contentContainer" >
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    // je ne sais pas le quel est le meilleur moyen de le recup
    // this.$store.state.user.isAdmin || !this.$store.getters.getUser.isAdmin
    if (!this.$store.state.user) {
      this.$router.push("/")
    } else {
      if (this.$store.state.user.isAdmin === false) {
        this.$router.push("/")
      }
    }
  }
}
</script>

<style lang="css">
.layouts {
  width: 100%;
  height: 100vh;
  background-color: white;
}
.content-link {
  background-color: #eee;
  margin: 10px 0;
  padding: 10px 15px;
  border-radius: 5px;
  color: #23527c;
}
.content-link:hover,
.content-link.router-link-active {
  background-color: #337ab7;
  color: #fff;
}
.adminNav,
.adminNav li {
  list-style: none;
  text-align: left;
  margin: 0;
  padding: 0;
}
.adminNav a {
  display: block;
  text-decoration: none;
}
.admnNav a:hover {
  background-color: #eee;
}
#closeAdminPanel {
  display: block;
  width: 26px;
  height: 26px;
  float: right;
  background-image: url(../assets/img/close.png);
  position: absolute;
  top: 10px;
  right: 15px;
}
.container {
  position: relative;
}
</style>
