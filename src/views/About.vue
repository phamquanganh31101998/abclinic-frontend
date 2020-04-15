<template>
  <v-container>
        <v-row>
            <v-col>
                <h1>Giới thiệu bệnh viện ở đaya</h1>
                <v-btn @click="checkLocalStorage()">Click here</v-btn>
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
