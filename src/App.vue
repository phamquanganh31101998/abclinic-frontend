<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-btn text :large="true" @click="goToHomePage()">
          <v-img
            alt="Vuetify Logo"
            class=""
            contain
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
            transition="scale-transition"
            width="40"
          />

          <h1>ABCLINIC</h1>
        </v-btn>
      </div>

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
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
    
  },

  data: () => ({
    //
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
