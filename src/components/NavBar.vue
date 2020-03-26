<template>
    <v-navigation-drawer
        app
        color="primary"
        dark
        v-model="drawer"
            >
        <v-list
            nav
            dense
            >
            <v-list-item-group
            >
            <v-list-item @click="goToHomePage()">
                <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Trang chủ</v-list-item-title>
            </v-list-item>

            <v-list-item @click="goToInfoPage()">
                <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Thông tin người dùng</v-list-item-title>
            </v-list-item>

            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    computed:{
        ...mapGetters({
            drawer: 'navDrawer'
        })
    },
    methods: {
        goToHomePage(){
            this.$router.replace('/')
        },
        goToInfoPage(){
            this.$router.replace('/info')
        },
    }
}
</script>