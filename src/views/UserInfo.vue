<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Thông tin người dùng</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col xl="12">
                <v-card v-if="userInfo != null">
                    <v-card-title>
                    </v-card-title>
                    <v-card-text>
                        <v-form v-model="valid">
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12" md="8" lg="3" xl="3">
                                        <v-avatar v-if="userInfo.avatar" width="300" height="300">
                                            <img
                                                :src="userInfo.avatar"
                                                >
                                        </v-avatar>
                                        <br>
                                        <v-file-input accept="image/*" v-model="file" label="Cập nhật ảnh đại diện tại đây" append-icon="edit"></v-file-input>
                                        <v-btn @click="uploadAvatar()" v-if="file" color="primary" rounded>Cập nhật ảnh đại diện</v-btn>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12" lg="8" xl="8">
                                        <v-row wrap>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-text-field readonly :rules="noEmptyRules" v-model="userInfo.name" label="Tên người dùng"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-text-field readonly :value="returnRole(userInfo.role)" label="Chức vụ"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-text-field
                                                    v-model="userInfo.dateOfBirth"
                                                    label="Ngày sinh"
                                                    readonly
                                                    >
                                                </v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                Giới tính
                                                <v-radio-group v-model="userInfo.gender" row readonly>
                                                    <v-radio label="Nam" value="0"></v-radio>
                                                    <v-radio label="Nữ" value="1"></v-radio>
                                                    <v-radio label="Khác" value="2"></v-radio>
                                                </v-radio-group>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-text-field v-model="userInfo.email" :rules="emailRules" label="Email" append-icon="edit"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-text-field v-model="userInfo.phoneNumber" :rules="phoneRules" label="Số điện thoại" append-icon="edit"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row v-if="userInfo.role != 'COORDINATOR' && userInfo.role != 'PATIENT'">
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-textarea v-model="userInfo.description" rows="4" label="Ghi chú" append-icon="edit"></v-textarea>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-btn @click="updateInfo(userInfo.email, userInfo.phoneNumber, userInfo.description)" :disabled="!valid" rounded color="primary">Cập nhật thông tin cá nhân</v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-row v-if="userInfo.role == 'PRACTITIONER'">
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8" v-if="userInfo.role != 'COORDINATOR' && userInfo.role != 'PATIENT'">
                                                <v-autocomplete multiple label="Chuyên môn" :items="allSpecialties" item-text="name" item-value="id" v-model="userInfo.specialties"></v-autocomplete>
                                            </v-col>
                                        </v-row>
                                        <v-row v-if="userInfo.role == 'PRACTITIONER'">
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-btn @click="updateSpecialties(userInfo.specialties, true)" rounded color="primary">Cập nhật chuyên môn</v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-row v-if="userInfo.role == 'SPECIALIST' || userInfo.role == 'DIETITIAN'">
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8" v-if="userInfo.role != 'COORDINATOR' && userInfo.role != 'PATIENT'">
                                                <v-autocomplete v-if="userInfo.specialty != null" label="Chuyên môn" :items="allSpecialties" item-text="name" item-value="id" v-model="userInfo.specialty.id"></v-autocomplete>
                                                <v-btn v-if="userInfo.specialty != null" @click="updateSpecialties(userInfo.specialty.id, false)" rounded color="primary">Cập nhật chuyên môn</v-btn>
                                                <v-autocomplete v-if="userInfo.specialty == null" label="Chuyên môn" :items="allSpecialties" item-text="name" item-value="id" v-model="specialtyId"></v-autocomplete>
                                                <v-btn v-if="userInfo.specialty == null" @click="updateSpecialties(specialtyId, false)" rounded color="primary">Cập nhật chuyên môn</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
const axios = require('axios');
import apiService from '../services/api.service'
import config from '../config'
import func from '../helpers/common_function'
export default {
    data(){
        return{
            valid: false,
            userInfo: null,
            file: null,
            emailRules: [
                v => !!v || 'Chưa nhập E-mail',
                v => /.+@.+/.test(v) || 'E-mail không đúng định dạng',
            ],
            noEmptyRules: [
                v => !!v || 'Không được để trống',
            ],
            phoneRules: [
                v => /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\\./0-9]*$/g.test(v) || 'Không được để trống và chỉ được nhập số',
            ],
            allSpecialties: [],
            //check when specialist/dietitian specialty is null
            specialtyId: 0,
        }
    },
    methods: {
        getInfo(){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang lấy thông tin người dùng...')
            let url = `${config.apiUrl}/user`
            apiService.getApi(url).then(result=> {
                if(result.status.toString()[0] === "2"){
                    this.userInfo = result.data
                    this.userInfo.gender = result.data.gender.toString()
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
            })
        },
        returnRole(role){
            return func.returnRole(role)
        },
        updateInfo(email, phone, description){
            this.$store.dispatch('turnOnLoadingDialog', 'Cập nhật thông tin cá nhân...')
            let body = {
                email: email,
                phone: phone
            }
            if(description){
                body.description = description
            }
            let url = `${config.apiUrl}/user`
            apiService.putApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Cập nhật thông tin thành công',
                        type: 'success',
                    })
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
            })
        },
        uploadAvatar(){
            this.$store.dispatch('turnOnLoadingDialog', 'Cập nhật ảnh đại diện...')
            let formData = new FormData();
            formData.append('file', this.file);
            let url = `${config.apiUrl}/images/avatar`
            axios.post(url, formData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('ac_uid')
                    }
                }
            ).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Cập nhật ảnh đại diện thành công',
                        type: 'success',
                        })
                    this.userInfo.avatar = result.data
                    this.file = null;
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
            })
        },
        getAllSpecialties(){
            let url = `${config.apiUrl}/specialties`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.allSpecialties = result.data
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                    })
                }
            }).catch(error => {
                console.log(error)
            })
        },
        updateSpecialties(spec, isPrac){
            this.$store.dispatch('turnOnLoadingDialog', 'Cập nhật chuyên môn...')
            let url = `${config.apiUrl}/user/specialties`
            let body = {
                specialties: []
            }
            //Mang cac ID
            if(isPrac){
                body.specialties = spec;
            }
            //Chi nhan 1 id
            else {
                body.specialties.push(spec)
            }
            apiService.putApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Cập nhật chuyên môn thành công',
                        type: 'success',
                    })
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                    })
                }
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        }
    },
    created(){
        this.getInfo()
        this.getAllSpecialties()
    }
}
</script>
<style scoped>

</style>