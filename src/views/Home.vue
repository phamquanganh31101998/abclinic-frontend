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
// import {eventBus} from '../eventBus'
import {mapGetters} from 'vuex'
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
  computed: {
    ...mapGetters({
        newNotification: 'newNotification'
    })
  },
  watch: {
      newNotification(){
        this.handleNewNotification(this.newNotification)
    }
  },
  methods: {
    goToPage(link){
      this.$router.push(link)
    },
    checkUID(){
        let url = `${config.userUrl}`
        apiService.getApi(url).then(result => {
            if(result.status === 200){
              if(result.data.role == 'PATIENT'){
                  this.$store.dispatch('clearAuthData')
                  this.$store.dispatch('turnOnAlert', {color: 'error', message: 'Trang này chỉ dành cho nhân viên phòng khám ABCLINIC'})
                }
                else {
                  this.$store.dispatch('setAuthData', result.data)
                  this.initWebSocket(this.$store.state.user.id)
                }
            }
            else {
                this.$store.dispatch('clearAuthData')
                this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
            }
            // else {
            //     this.$store.dispatch('clearAuthData')
            //     this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
            // }
        }).catch(error => {
            console.log(error)
        })
    },
    initWebSocket(id){
      let store = this.$store
      try{
        var wsocket = new SockJS('http://fathomless-savannah-38522.herokuapp.com/api/ws');
        var client = Stomp.over(wsocket);
        client.connect({}, function() {
          // console.log(frame)
            client.subscribe(`/topic/users/${id}`, function (message) {
                // console.log(message.body)
                // eventBus.newNotification(message.body)

                store.dispatch('setNewNotification', JSON.parse(message.body))
            });
        });
      }
      catch (error){
        console.log(error)
      }
    },
    handleNewNotification(e){
      this.$toast.open({
        message: e.notification,
        type: 'info',
      })
    }
  },
  components: {
    AppBar, NavBar
  },
  created() {
    this.checkUID()
    // eventBus.$on('newNotification', this.handleNewNotification);
  },
  // destroyed(){
  //   eventBus.$off('newNotification', this.handleNewNotification);
  // }
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
