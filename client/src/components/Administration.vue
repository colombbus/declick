<template lang="pug">
.tempFixScroll
  .container
    .row
      .col-md-3
        h2 Administration
        ul.adminNav
          li
            router-link.content-link(to="/administration/users") gestion des utilisateurs
          li
            router-link.content-link(to="/administration/courses") gestion des parcours
      .col-md-9.contentContainer
        router-view
</template>

<script>
export default {}
</script>

<style lang="scss">
.contentContainer > div {
  display: flex;
  justify-content: space-evenly;
  padding: 0 10px;
}

.text-center-flex-center {
  text-align: center;
  display: flex;
  justify-content: center;
}

ul.pagination#usersListPagination {
  display: flex;
  justify-content: space-between;
  list-style: none;
  width: 25%;
}

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

  &:hover,
  &.router-link-active {
    background-color: #337ab7;
    color: #fff;
  }
}

.adminNav {
  list-style: none;
  text-align: left;
  margin: 0;
  padding: 0;

  li {
    list-style: none;
    text-align: left;
    margin: 0;
    padding: 0;
  }

  /* float: left; */
  width: 200px;
  padding: 0 15px;

  a {
    display: block;
    text-decoration: none;
  }
}

.admnNav a:hover {
  background-color: #eee;
}

#closeAdminPanel {
  display: block;
  width: 26px;
  height: 26px;
  float: right;
  background-image: url(../assets/images/close.png);

  /* position: absolute; */
  top: 10px;
  right: 15px;
}

.container {
  position: relative;
}

.tempFixScroll {
  overflow: auto;
}
</style>
