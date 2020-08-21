<template>
    <v-navigation-drawer
        app
        dark
        :value="drawer"
        clipped
        style="color: #747780"
            >
        <v-list
            nav
            dense
            >
            <v-list-item v-show="user != null && user.role != 'COORDINATOR'" @click="goToPage('doctor')">
                <v-list-item-icon>
                    <v-icon>people</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Chức năng Bác sĩ</v-list-item-title>
            </v-list-item>
            <v-list-item v-show="user != null && user.role == 'COORDINATOR'" @click="goToPage('coordinator')">
                <v-list-item-icon>
                    <v-icon>directions_run</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Chức năng Điều phối viên</v-list-item-title>
            </v-list-item>
            <v-list-item @click="goToPage('notification')">
                <v-list-item-icon>
                    <v-icon>notification_important</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Các thông báo</v-list-item-title>
            </v-list-item>
            <v-list-item @click="goToPage('staff')">
                <v-list-item-icon>
                    <v-icon>local_hospital</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Thông tin phòng khám</v-list-item-title>
            </v-list-item>
            <v-list-item @click="goToPage('info')">
                <v-list-item-icon>
                    <v-icon>info</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Cài đặt tài khoản</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    computed:{
        ...mapGetters({
            drawer: 'navDrawer',
            user: 'user'
        }), 
    },
    methods: {
        goToPage(link){
            this.$router.replace(link)
        }
    }
}
</script>