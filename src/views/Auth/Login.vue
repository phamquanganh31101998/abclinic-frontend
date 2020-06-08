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
                <v-card class="elevation-4">
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
                            @keyup.enter="login()"
                        />
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" @click="login()">Đăng nhập</v-btn>
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
            //check when user not login yet
            checkUserRole(){
                // let uid = localStorage.getItem('ac_uid')
                let url = `${config.apiUrl}/user`
                apiService.getApi(url).then(result => {
                    if(result.status === 200){
                        if(result.data.role == 'PATIENT'){
                            this.$toast.open({
                                message: 'Trang này chỉ dành cho nhân viên phòng khám ABCLINIC',
                                type: 'error',
                                // all other options may go here
                            })
                            // this.$store.dispatch('turnOnAlert', {color: 'error', message: 'Trang này chỉ dành cho nhân viên phòng khám ABCLINIC'})
                            localStorage.removeItem('ac_uid')
                        }
                        else {
                            let user = result.data
                            this.$store.dispatch('setAuthData', user)
                            switch(user.role){
                                case 'COORDINATOR':
                                    this.goToPage('/coordinator');
                                    break;
                                case 'PRACTITIONER':
                                    this.goToPage('/practitioner');
                                    break;
                                case 'DIETITIAN':
                                case 'SPECIALIST':
                                    this.goToPage('/doctor');
                                    break;
                            }
                            // this.$router.push('/notification')
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
                apiService.login(url, body).then(result => {
                    if(result.status.toString()[0] === "2"){
                        localStorage.setItem('ac_uid', result.data)
                        this.checkUserRole()
                    }
                    else {
                        this.$toast.open({
                            message: result.data.message,
                            type: 'error',
                            // all other options may go here
                        })
                        // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => {
                    this.$store.dispatch('turnOffLoadingDialog')
                })
            },
            goToPage(link){
                this.$router.replace(link)
            },
        },
        created(){
            // this.miscMethod()
        }
    }
</script>
<style scoped>

</style>