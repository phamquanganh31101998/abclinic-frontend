<template>
    <v-app-bar
        clipped-left
        dense
        app
        color="primary"
        dark
        >
        <v-app-bar-nav-icon @click="toggleNavDrawer()"></v-app-bar-nav-icon>
        <v-btn text @click="goToPage('/about')">
            <v-toolbar-title>ABCLINIC</v-toolbar-title>
        </v-btn>
        <v-spacer></v-spacer>
        <v-menu v-model="notiMenu" :close-on-content-click="false" :nudge-width="300" left offset-y>
            <template v-slot:activator="{ on }">
                <v-icon x-large style="margin-right: 15px;" v-on="on" @click="openNotiMenu()">notification_important</v-icon>
            </template>
            <v-card
                max-width="375"
                class="mx-auto"
                >
                <v-list v-if="loadingNoti">
                    <v-list-item>
                        <v-list-item-content>
                            <div class="text-center">
                                <v-progress-circular
                                    :size="50"
                                    color="primary"
                                    indeterminate>
                                </v-progress-circular>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-btn
                            block
                            text
                            color="primary"
                            @click="notiMenu = false, $router.push('notification')"
                            >
                            <span class="mr-2" >Xem tất cả thông báo</span>
                            <v-icon>mdi-open-in-new</v-icon>
                        </v-btn>
                    </v-list-item>
                </v-list>
                <v-list v-else>
                    <template>
                        <v-list-item v-for="item in noti" :key="item.id" @click="notiMenu = false, goToServicePage(item.type, item.payloadId)">
                            <v-list-item-content>
                                <v-list-item-title>{{checkString(item.message)}}</v-list-item-title>
                                <v-list-item-subtitle>{{returnTimeFromTimeArray(item.createdAt)}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                    </template>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-btn
                            block
                            text
                            color="primary"
                            @click="notiMenu = false, $router.push('notification')"
                            >
                            <span class="mr-2" >Xem tất cả thông báo</span>
                            <v-icon>mdi-open-in-new</v-icon>
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="120" left offset-y>
            <template v-slot:activator="{ on }">
                <v-btn fab dark small color="primary" v-on="on">
                    <v-icon x-large>account_circle</v-icon>
                </v-btn>
            </template>
            <v-card
                max-width="375"
                class="mx-auto"
                >
                <v-list two-line>
                    <v-list-item v-if="user != null">
                        <v-list-item-icon>
                        <v-icon color="indigo">person</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                        <v-list-item-subtitle>{{returnRole(user.role)}}</v-list-item-subtitle>
                        <v-list-item-title>{{checkString(user.name)}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item v-if="user != null">
                        <v-list-item-icon>
                        <v-icon color="indigo">mdi-email</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                        <v-list-item-subtitle>Email</v-list-item-subtitle>
                        <v-list-item-title>{{checkString(user.email)}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item v-if="user != null">
                        <v-list-item-icon>
                        <v-icon color="indigo">mdi-phone</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                        <v-list-item-subtitle>Số điện thoại</v-list-item-subtitle>
                        <v-list-item-title>{{checkString(user.phoneNumber)}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>

                    <v-list-item>
                        <v-btn
                            text
                            color="primary"
                            @click="logout()"
                            >
                            <span class="mr-2" >Đăng xuất</span>
                            <v-icon>mdi-open-in-new</v-icon>
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>
    </v-app-bar>
</template>
<script>
import {mapGetters} from 'vuex'
import config from '../config'
import apiService from '../services/api.service'
import func from '../helpers/common_function'
export default {
    data() {
        return {
            menu: false,
            notiMenu: false,
            noti: [],
            loadingNoti: false,
        }
    },
    computed: {
        ...mapGetters({
            user: 'user'
        })
    },
    methods: {
        returnTimeFromTimeArray(arr){
            return func.returnTimeFromTimeArray(arr)
        },
        checkString(str){
            return func.checkString(str)
        },
        returnRole(role){
            return func.returnRole(role)
        },
        goToServicePage(type, id){
            let obj = {
                typeNoti: type,
                payloadId: id
            }
            this.$store.dispatch('setHandleNotification', obj)
            let role = this.user.role.toLowerCase()
            switch(role){
                case "COORDINATOR": {
                    this.goToPage('coordinator')
                    break;
                }
                case "PRACTITIONER":
                case "SPECIALIST":
                case "DIETITIAN": {
                    this.goToPage('doctor')
                    break;
                }
                default: {
                    break;
                }
            }
        },
        openNotiMenu(){
            if(!this.notiMenu){
                this.getNoti()
            }
        },
        getNoti(){
            this.loadingNoti = true;
            let url = `${config.apiUrl}/notifications`
            let params = {
                page: 1,
                size: 5,
            }
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.noti = result.data.content
                    console.log(this.noti)
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                    })
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.loadingNoti = false;
            })
        },
        goToPage(link){
            this.$router.replace(link)
        },
        toggleNavDrawer(){
            this.$store.dispatch('toggleNavDrawer')
        },
        logout(){
            this.menu = false
            this.$store.dispatch('turnOnLoadingDialog', 'Đăng xuất...')
            let url = `${config.apiUrl}/auth/sign_out`
            apiService.postApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOffLoadingDialog')
                    this.$store.dispatch('clearAuthData')
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                    })
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        }
    }
}
</script>
<style scoped>
</style>