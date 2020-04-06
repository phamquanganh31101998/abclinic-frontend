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
        <transition name="slide" mode="out-in">
            <router-view></router-view>
        </transition>
    </v-content>
    <nav-bar></nav-bar>
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

<style>
    .slide-enter-active {
        animation: slide-in 200ms ease-out forwards;
    }

    .slide-leave-active {
        animation: slide-out 200ms ease-out forwards;
    }

    @keyframes slide-in {
        from {
            transform: translateY(-30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slide-out {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-30px);
            opacity: 0;
        }
    }
</style>
