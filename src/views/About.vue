<template>
  <v-container class="full-height">
        <v-row class="fill-height">
            <v-col cols="12" sm="12" lg="12" md="12" xl="12">
                <v-btn @click="checkLocalStorage()">Click</v-btn>
                <!-- <iframe src="https://vnexpress.net/suc-khoe/tin-tuc" style="height: 800px; width: 100%;"></iframe> -->
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import apiService from '../services/api.service'
// import config from '../config'
export default {
    methods: {
        checkLocalStorage(){
            console.log(this.$store.state.ac_uid)
            console.log(this.$store.state.user)
        },
        test(){
            let params = {
                page: 1,
                size: 4
            }
            let url = `https://fathomless-savannah-38522.herokuapp.com/api/notifications`
            apiService.getApi(url, params).then(result => {
                console.log(result)
                if(result.status != 200 && result.status != 201){
                    let alertObj = {
                        message: `Lỗi: ${result.data.message} (${result.status})`,
                        color: 'error'
                    }
                    this.$store.dispatch('turnOnAlert', alertObj)
                }
            }).catch(error => {
                alert(error)
            })
        },
        // checkUID(){
        //     // let uid = localStorage.getItem('ac_uid')
        //     let url = `${config.userUrl}`
        //     apiService.getApi(url).then(result => {
        //         console.log(result)
        //         if(result.status === 200){
        //             this.$store.dispatch('setAuthData', result.data)
        //         }
        //         else if (result.status === 401){
        //             this.$store.dispatch('clearAuthData')
        //         }
        //     }).catch(error => {
        //         console.log(error)
        //     })
        // }
    },
    created(){
        // this.checkUID()
        // this.test()
    }
}
</script>
<style scoped>

</style>
