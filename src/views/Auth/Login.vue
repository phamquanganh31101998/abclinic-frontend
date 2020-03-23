<template>
    <v-container>
        <v-row>
            <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                <v-btn @click="miscMethod()">Click to test</v-btn>
                <p>{{responseText}}</p>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
    import config from '../../config'
    import apiService from '../../services/api.service'
    export default {
        data(){
            return {
                responseText: 'Try something'
            }
        },
        methods: {
            miscMethod(){
                let param = {
                    Authorization: 'd8161da9-722c-49cb-9cc7-74b8dde1d514'
                }
                let url = `${config.miscUrl}/accounts`
                apiService.getApi(url, param).then(result => {
                    this.responseText = result
                }).catch(error => {
                    console.log(error)
                })
            }
        },
        created(){
            // this.miscMethod()
        }
    }
</script>
<style scoped>

</style>