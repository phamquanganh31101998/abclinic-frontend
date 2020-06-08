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
        <!-- <v-btn
            text
            >
            <span class="mr-2" @click="logout()">Đăng xuất</span>
            <v-icon>mdi-open-in-new</v-icon>
        </v-btn> -->
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="120" left offset-y>
            <template v-slot:activator="{ on }">
                <v-btn fab dark small color="primary" v-on="on">
                    <!-- <v-img width="40px" height="40px" :src="user.avatar" v-if="user != null && user.avatar != null"></v-img> -->
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
                        <!-- <v-row>
                            <v-col>
                                <a @click="logout()">Đăng xuất</a>
                            </v-col>
                        </v-row> -->
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
export default {
    data() {
        return {
            menu: false
        }
    },
    computed: {
        ...mapGetters({
            user: 'user'
        })
    },
    methods: {
        checkString(str){
            return (str != null & str != undefined) ? str : '_'
        },
        returnRole(role){
            switch(role){
                case "COORDINATOR": {
                    return "Điều phối viên"
                }
                case "PRACTITIONER": {
                    return "Bác sĩ đa khoa"
                }
                case "SPECIALIST": {
                    return "Bác sĩ chuyên khoa"
                }
                case "DIETITIAN": {
                    return "Bác sĩ dinh dưỡng"
                }
                default: {
                    return "_"
                }
            }
        },
        goToPage(link){
            this.$router.replace(link)
        },
        toggleNavDrawer(){
            this.$store.dispatch('toggleNavDrawer')
        },
        logout(){
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
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
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
    .disable-events {
        pointer-events: none
    }
</style>