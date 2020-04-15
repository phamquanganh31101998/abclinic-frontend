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
import apiService from '../services/api.service'
import config from '../config'
export default {
  data(){
    return {
      
    }
  },
  methods: {
    goToPage(link){
      this.$router.push(link)
    },
    checkUID(){
        // let uid = localStorage.getItem('ac_uid')
        let url = `${config.userUrl}`
        apiService.getApi(url).then(result => {
            console.log(result)
            if(result.status === 200){
                this.$store.dispatch('setAuthData', result.data)
            }
            else if (result.status === 401){
                this.$store.dispatch('clearAuthData')
            }
        }).catch(error => {
            console.log(error)
        })
    }
  },
  components: {
    AppBar, NavBar
  },
  created() {
    console.log('Home created!!')
    this.checkUID()
    // this.goToPage('/about')
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
