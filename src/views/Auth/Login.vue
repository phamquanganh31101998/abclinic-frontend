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
                sm="10"
                offset-sm="1"
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
                        <v-btn color="primary" @click="login()">Login</v-btn>
                    </v-card-actions>
                </v-card>
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
            }
        },
        methods: {
            checkUID(){
                // let uid = localStorage.getItem('ac_uid')
                let url = `${config.userUrl}`
                apiService.getApi(url).then(result => {
                    if(result.status === 200){
                        if(result.data.role == 'PATIENT'){
                            this.$store.dispatch('turnOnAlert', {color: 'error', message: 'Trang này chỉ dành cho nhân viên phòng khám, không dành cho bệnh nhân đăng nhập'})
                        }
                        else {
                            this.$store.dispatch('setAuthData', result.data)
                            this.$router.push('/info')
                        }
                    }
                    else if (result.status === 401){
                        this.$store.dispatch('clearAuthData')
                    }
                }).catch(error => {
                    console.log(error)
                })
            },
            login(){
                this.$store.dispatch('turnOnLoadingDialog', 'Đăng nhập...')
                let info = this.info
                let password = this.password
                let url = `${config.apiUrl}/auth/login`
                let body = {
                    account: info,
                    password: password
                }
                apiService.postApi(url, body).then(result => {
                    if(result.status.toString()[0] === "2"){
                        // console.log(result)
                        localStorage.setItem('ac_uid', result.data)
                        this.checkUID()
                    }
                    else {
                        this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                    }
                    // localStorage.setItem('ac_uid', result.data)
                    // this.$router.push('/info')
                }).catch(error => {
                    console.log(error)
                }).finally(() => {
                    this.$store.dispatch('turnOffLoadingDialog')
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