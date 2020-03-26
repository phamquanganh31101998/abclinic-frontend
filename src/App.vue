<template>
  <v-app>
    <v-app-bar
      dense
      app
      color="primary"
      dark
      >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
  
      <v-toolbar-title>ABCLINIC</v-toolbar-title>
      <!-- <div class="d-flex align-center">
        <v-btn text :large="true" @click="goToHomePage()">
          <v-img
            alt="Vuetify Logo"
            class=""
            contain
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
            transition="scale-transition"
            width="40"
          />

          <h2>ABCLINIC</h2>
        </v-btn>
      </div> -->

      <v-spacer></v-spacer>
      <v-btn text @click="goToInfoPage()">
        <span class="mr-2">Cài đặt</span>
        <v-icon>build</v-icon>
      </v-btn>
      <v-btn
        href="#"
        text
        >
        <span class="mr-2">Đăng xuất</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
    
  },

  data: () => ({
    //
    drawer: false,
  }),
  methods: {
    goToHomePage(){
      this.$router.replace('/')
    },
    goToInfoPage(){
      this.$router.replace('/info')
    }
  }
};
</script>
