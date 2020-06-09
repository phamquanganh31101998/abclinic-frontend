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
import firebase from 'firebase/app'
import moment from 'moment'
import jwt from 'jsonwebtoken'
require("firebase/messaging");
export default {
  data(){
    return {
      firebaseNoti: null,
      messaging: null
    }
  },
  computed: {
    ...mapGetters({
        newNotification: 'newNotification',
        user: 'user'
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
        let url = `${config.apiUrl}/user`
        apiService.getApi(url).then(result => {
            if(result.status === 200){
              if(result.data.role == 'PATIENT'){
                  this.$store.dispatch('clearAuthData')
                  this.$toast.open({
                      message: 'Trang này chỉ dành cho nhân viên phòng khám ABCLINIC',
                      type: 'error',
                      // all other options may go here
                  })
                  // this.$store.dispatch('turnOnAlert', {color: 'error', message: 'Trang này chỉ dành cho nhân viên phòng khám ABCLINIC'})
                }
                else {
                  this.$store.dispatch('setAuthData', result.data)
                  this.initWebSocket(this.$store.state.user.id)
                  // this.initFirebase()
                }
            }
            else {
                this.$store.dispatch('clearAuthData')
                this.$toast.open({
                    message: result.data.message,
                    type: 'error',
                    // all other options may go here
                })
                // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
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
        var wsocket = new SockJS(`${config.apiUrl}/ws`);
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
    initFirebase(){
      // this.firebaseNoti = new Firebase('https://abclinic-noti.firebaseio.com/');
      // console.log(this.firebaseNoti)
      var firebaseConfig = {
        apiKey: "AIzaSyDqCVFqxlFpTYDqQu_plYuiy6ekAwv6eH4",
        authDomain: "abclinic-noti.firebaseapp.com",
        databaseURL: "https://abclinic-noti.firebaseio.com",
        projectId: "abclinic-noti",
        storageBucket: "abclinic-noti.appspot.com",
        messagingSenderId: "874025458781",
        appId: "1:874025458781:web:f2079bcf9d5d72887101b4",
        measurementId: "G-GGPSEYWL2W"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      // firebase.analytics();
      this.messaging = firebase.messaging();
      this.messaging.usePublicVapidKey('BNC-v9WL4BKp2PbtS7sO29B7VXefCb560WnQBkhGCSRS1sfC940DIXFoTI5yOKUVxiXbwsGc89ULw1lcUuJczwg')
      // console.log(this.messaging)
      this.messaging.onMessage((payload) => {
        alert('Message received. ', payload);
        // ...
      });
      // console.log(this.messaging)
      // this.messaging.child(`users-${this.user.id}`).on('child_added', function(snapshot){
      //   var message = snapshot.val();
      //   console.log(message)
      // })
    },
    handleNewNotification(e){
      let time = moment().format('HH:mm:ss')
      this.$toast.open({
        message: `THÔNG BÁO MỚI: ${e.notification}! (${time})`,
        type: 'info',
      })
    },
    checkExpiredUID(){
      let info = jwt.decode(localStorage.getItem('ac_uid'));
      // console.log(info)
      let expDay = moment(info.exp * 1000);
      let today = moment();
      if(today.isAfter(expDay)){
          this.$store.dispatch('clearAuthData')
          this.$toast.open({
              message: 'Phiên đăng nhập của bạn đã hết hạn. Hãy đăng nhập lại',
              type: 'error',
              // all other options may go here
          })
      }
      else {
        this.checkUID()
      }
    }
  },
  components: {
    AppBar, NavBar
  },
  created() {
    this.checkExpiredUID()
    // this.checkUID()
    
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
