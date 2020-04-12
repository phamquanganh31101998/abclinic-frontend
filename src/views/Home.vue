<template>
  <!-- <div class="home">
    <v-container>
      <v-row>
        <v-col>
          <h1>Home page</h1>
        </v-col>
      </v-row>
    </v-container>
  </div> -->
  <v-app>
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
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import AppBar from '../components/AppBar'
import NavBar from '../components/NavBar'
export default {
  data(){
    return {

    }
  },
  components: {
    AppBar, NavBar
  },
  methods: {
  }
}
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
