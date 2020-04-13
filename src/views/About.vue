<template>
  <v-container>
        <v-row>
            <v-col>
                <h1>Giới thiệu bệnh viện ở đaya</h1>
                <v-btn @click="test()">Click here</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import apiService from '../services/api.service'
export default {
    methods: {
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
                        message: `Lỗi: ${result.data.message}`,
                        color: 'error'
                    }
                    this.$store.dispatch('turnOnAlert', alertObj)
                }
            }).catch(error => {
                alert(error)
            })
        }
    },
    created(){
        this.test()
    }
}
</script>
<style scoped>

</style>
