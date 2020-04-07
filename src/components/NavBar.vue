<template>
    <v-navigation-drawer
        app
        color="primary"
        dark
        :value="drawer"
            >
        <v-list
            nav
            dense
            >
            <v-list-item @click="goToPage()">
                <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Trang chủ</v-list-item-title>
            </v-list-item>

            <v-list-item @click="goToPage('info')">
                <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Thông tin người dùng</v-list-item-title>
            </v-list-item>
            <v-list-item @click="goToPage('practitioner')">
                <v-list-item-icon>
                    <v-icon>add</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Bác sĩ đa khoa</v-list-item-title>
            </v-list-item>
            <v-list-item @click="goToPage('specialist')">
                <v-list-item-icon>
                    <v-icon>add</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Bác sĩ chuyên khoa</v-list-item-title>
            </v-list-item>
            <v-list-item @click="goToPage('coordinator')">
                <v-list-item-icon>
                    <v-icon>add</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Điều phối viên</v-list-item-title>
            </v-list-item>
            <v-list-item @click="goToPage('staff')">
                <v-list-item-icon>
                    <v-icon>add</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Chức năng chung</v-list-item-title>
            </v-list-item>
        
        </v-list>
    </v-navigation-drawer>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    computed:{
        ...mapGetters({
            drawer: 'navDrawer'
        }),

    },
    methods: {
        goToPage(page){
            if(page){
                // console.log(this.$store.state.ac_uid)
                let url = `/${page}`
                this.$router.push(url)
            }
            else{
                this.$router.push('/')
            }
        }
    }
}
</script>