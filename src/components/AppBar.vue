<template>
    <v-app-bar
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
export default {
    methods: {
        goToPage(link){
            this.$router.replace(link)
        },
        toggleNavDrawer(){
            this.$store.dispatch('toggleNavDrawer')
        },
        logout(){
            this.$router.dispatch('clearAuthData')
            // this.$router.replace('/login')
        }
    }
}
</script>