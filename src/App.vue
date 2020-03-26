<template>
  <v-app>
    <!-- <v-app-bar
      dense
      app
      color="primary"
      dark
      >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn text @click="goToHomePage()">
        <v-toolbar-title>ABCLINIC</v-toolbar-title>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        href="#"
        text
        >
        <span class="mr-2" @click="logout()">Đăng xuất</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar> -->
    <app-bar></app-bar>
    <v-content>
        <router-view></router-view>
    </v-content>
    <nav-bar></nav-bar>
    <!-- <v-navigation-drawer
      app
      color="primary"
      dark
      v-model="drawer"
        >
      <v-list
        nav
        dense
        >
        <v-list-item-group
          >
          <v-list-item @click="goToHomePage()">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Trang chủ</v-list-item-title>
          </v-list-item>

          <v-list-item @click="goToInfoPage()">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Thông tin người dùng</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer> -->
  </v-app>
</template>

<script>
import AppBar from '../src/components/AppBar'
import NavBar from '../src/components/NavBar'
export default {
  name: 'App',

  components: {
    AppBar, NavBar
  },

  data: () => ({
    //
    drawer: false,
  }),
  methods: {
    goToHomePage(){
        this.$router.replace('/')
    },
    
  }
};
</script>
