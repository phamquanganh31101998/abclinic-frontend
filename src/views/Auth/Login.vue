<template>
    <v-container
        class="fill-height"
        fluid>
        <v-row
            align="center"
            justify="center"
            >
            <v-col
                cols="12"
                sm="8"
                md="4"
            >
                <v-card class="elevation-12">
                    <v-toolbar
                        color="primary"
                        dark
                        flat
                        >
                        <v-toolbar-title>ĐĂNG NHẬP VÀO HỆ THỐNG ABCLINIC</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                        <v-text-field
                            label="Email/SDT"
                            prepend-icon="person"
                            type="text"
                            v-model="info"
                        />

                        <v-text-field
                            v-model="password"
                            label="Password"
                            prepend-icon="lock"
                            type="password"
                        />
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" @click="login">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                {{responseText}}
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
                info: '',
                password: '',
                responseText: 'Try something'
            }
        },
        methods: {
            // miscMethod(){
            //     // let param = {
            //     //     Authorization: '8eec535a-10f2-4d0d-bd07-b67784fd2fd4'
            //     // }                                                                                                                                                                                
            //     let url = `${config.miscUrl}/accounts`
            //     // let url = `${config.userUrl}`
            //     apiService.getApi(url).then(result => {
            //         console.log(result)
            //         this.responseText = result
            //     }).catch(error => {
            //         console.log(error)
            //     })
            // }
            login(){
                let info = this.info
                let password = this.password
                // console.log(info)
                // console.log(password)
                let emailPattern = /.+@.+/;
                let phonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\\./0-9]*$/g;
                if (emailPattern.test(info)){
                    let url = `${config.authUrl}/login/email`
                    let params = {
                        email: info,
                        password: password
                    }
                    apiService.login(url, params).then(result => {
                        this.responseText = result
                        localStorage.setItem('ac_uid', result.data)
                        this.$router.push('/info')
                    }).catch(error => {
                        console.log(error)
                    })
                }
                else if (phonePattern.test(info)){
                    let url = `${config.authUrl}/login/phone`
                    let params = {
                        phone: info,
                        password: password
                    }
                    apiService.login(url, params).then(result => {
                        this.responseText = result
                        localStorage.setItem('ac_uid', result.data)
                        this.$router.push('/about')
                    }).catch(error => {
                        console.log(error)
                    })
                }
                else {
                    alert('Phải nhập đúng định dạng email hoặc số điện thoại')
                }
            }
        },
        created(){
            // this.miscMethod()
        }
    }
</script>
<style scoped>

</style>