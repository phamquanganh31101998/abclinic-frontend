<template>
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
import {eventBus} from '../eventBus'
import SockJS from 'sockjs-client'
import Stomp from'stomp-websocket'
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
            // console.log(result)
            if(result.status === 200){
                this.$store.dispatch('setAuthData', result.data)
                this.initWebSocket(this.$store.state.user.id)
            }
            else if (result.status === 401){
                this.$store.dispatch('clearAuthData')
            }
        }).catch(error => {
            console.log(error)
        })
    },
    initWebSocket(id){
      try{
        var wsocket = new SockJS('http://fathomless-savannah-38522.herokuapp.com/api/ws');
        var client = Stomp.over(wsocket);
        client.connect({}, function(frame) {
          console.log(frame)
            client.subscribe(`/topic/users/${id}`, function (message) {
                eventBus.newNotification(message.body)
            });
        });
      }
      catch (error){
        console.log(error)
      }
    },
    handler(e){
      this.$toast.open({
        message: e,
        type: 'info'
      })
    }
  },
  components: {
    AppBar, NavBar
  },
  created() {
    this.checkUID()
    eventBus.$on('newNotification', this.handler);
  },
  destroyed(){
    eventBus.$off('newNotification', this.handler);
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
