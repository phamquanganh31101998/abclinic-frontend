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
                // let param = {
                //     Authorization: '8eec535a-10f2-4d0d-bd07-b67784fd2fd4'
                // }                                                                                                                                                                                
                let url = `${config.miscUrl}/accounts`
                // let url = `${config.userUrl}`
                apiService.getApi(url).then(result => {
                    console.log(result)
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