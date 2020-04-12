<template>
    <v-app-bar
        dense
        app
        color="primary"
        dark
        >
        <v-app-bar-nav-icon @click="toggleNavDrawer()"></v-app-bar-nav-icon>
        <v-btn text @click="goToHomePage()">
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
        goToAboutPage(){
            this.$router.replace('/about')
        },
        toggleNavDrawer(){
            this.$store.dispatch('toggleNavDrawer')
        },
        logout(){
            localStorage.removeItem('ac_uid')
            this.$router.replace('/login')
        }
    }
}
</script>