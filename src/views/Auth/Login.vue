<template>
    <v-container
        class="fill-height content"
        fluid>
        <v-row
            align="center"
            justify="center"
            >
            <v-col
                sm="6"
                md="4"
                lg="3"
                xl="3"
                >
                <v-card class="elevation-4">
                    <v-toolbar
                        color="primary"
                        dark
                        flat
                        >
                        <v-toolbar-title>ĐĂNG NHẬP ABCLINIC</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text style="background-color: #FFFFFF">
                        <v-form v-model="valid">
                            <v-text-field
                                label="Email hoặc số điện thoại"
                                prepend-icon="person"
                                type="text"
                                v-model="info"
                                :rules="noEmptyRules"
                            />

                            <v-text-field
                                v-model="password"
                                label="Mật khẩu"
                                prepend-icon="lock"
                                type="password"
                                :rules="noEmptyRules"
                            />
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <!-- <v-spacer /> -->
                        <v-btn :disabled="!valid || logging" block color="primary" @click="login()">Đăng nhập</v-btn>
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
                logging: false,
                valid: false,
                noEmptyRules: [
                    v => !!v || 'Không được để trống',
                ],
            }
        },
        methods: {
            checkUserRole(){
                let url = `${config.apiUrl}/user`
                apiService.getApi(url).then(result => {
                    if(result.status === 200){
                        if(result.data.role == 'PATIENT'){
                            this.$toast.open({
                                message: 'Trang này chỉ dành cho nhân viên phòng khám ABCLINIC',
                                type: 'error',
                            })
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
                                case 'DIETITIAN':
                                case 'SPECIALIST':
                                    this.goToPage('/doctor');
                                    break;
                            }
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
                this.logging = true;
                this.$store.dispatch('turnOnLoadingDialog', 'Đang đăng nhập...')
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
                        })
                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => {
                    this.$store.dispatch('turnOffLoadingDialog')
                    this.logging = false;
                })
            },
            goToPage(link){
                this.$router.replace(link)
            },
        },
        created(){
        }
    }
</script>
<style scoped>
@media screen and (max-width: 600px) {
    .content {
        background-image: url('../../../public/mobile3.jpg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
}

@media screen and (min-width: 601px) {
    .content {
        background-image: url('../../../public/tablet1.jpg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
}

@media screen and (min-width: 1265px) {
    .content {
        background-image: url('../../../public/desktop2.jpg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
}
</style>