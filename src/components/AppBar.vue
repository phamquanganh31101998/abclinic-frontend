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
        <v-btn
            href="#"
            text
            >
            <span class="mr-2" @click="logout()">Đăng xuất</span>
            <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
    </v-app-bar>
</template>
<script>
import config from '../config'
import apiService from '../services/api.service'
export default {
    methods: {
        goToPage(link){
            this.$router.replace(link)
        },
        toggleNavDrawer(){
            this.$store.dispatch('toggleNavDrawer')
        },
        logout(){
            let url = `${config.apiUrl}/auth/sign_out`
            apiService.postApiParams(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('clearAuthData')
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            })
            this.$router.dispatch('clearAuthData')
            // this.$router.replace('/login')
        }
    }
}
</script>