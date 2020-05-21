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
            this.$store.dispatch('turnOnLoadingDialog', 'Đăng xuất...')
            let url = `${config.apiUrl}/auth/sign_out`
            apiService.postApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOffLoadingDialog')
                    this.$store.dispatch('clearAuthData')
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
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