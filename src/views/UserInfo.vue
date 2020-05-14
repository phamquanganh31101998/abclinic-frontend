<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Thông tin người dùng</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col xl="12">
                <v-card>
                    <v-card-title>
                    </v-card-title>
                    <v-card-text>
                        <v-form v-model="valid">
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12" md="8" lg="3" xl="3">
                                        <v-avatar v-if="avatar" width="300" height="300">
                                            <img
                                                :src="avatar"
                                                >
                                        </v-avatar>
                                        <br>
                                        <v-file-input accept="image/*" v-model="file" label="Cập nhật ảnh đại diện tại đây" append-icon="edit"></v-file-input>
                                        <v-btn @click="uploadAvatar()" v-if="file" color="primary" rounded>Cập nhật Avatar</v-btn>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12" lg="8" xl="8">
                                        <v-row wrap>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-text-field readonly :rules="noEmptyRules" v-model="name" label="Tên người dùng"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-text-field readonly :value="returnRole(role)" label="Chức vụ"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <!-- <v-menu
                                                    ref="menu"
                                                    v-model="dateMenu"
                                                    :close-on-content-click="false"
                                                    :return-value.sync="dateOfBirth"
                                                    transition="scale-transition"
                                                    offset-y
                                                    min-width="290px"
                                                    >
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field
                                                            v-model="dateOfBirth"
                                                            label="Ngày sinh"
                                                            prepend-icon="event"
                                                            readonly
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="dateOfBirth" no-title scrollable>
                                                    <v-spacer></v-spacer>
                                                    <v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
                                                    <v-btn text color="primary" @click="$refs.menu.save(dateOfBirth)">OK</v-btn>
                                                    </v-date-picker>
                                                </v-menu> -->
                                                <v-text-field
                                                    v-model="dateOfBirth"
                                                    label="Ngày sinh"
                                                    prepend-icon="event"
                                                    readonly
                                                    >
                                                </v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                Giới tính
                                                <v-radio-group v-model="gender" row readonly>
                                                    <v-radio label="Nam" value="0"></v-radio>
                                                    <v-radio label="Nữ" value="1"></v-radio>
                                                    <v-radio label="Khác" value="2"></v-radio>
                                                </v-radio-group>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-text-field v-model="email" :rules="emailRules" label="Email" append-icon="edit"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-text-field v-model="phoneNumber" :rules="phoneRules" label="Số điện thoại" append-icon="edit"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row v-if="description != null">
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-text-field v-model="description" :rules="phoneRules" label="Số điện thoại" append-icon="edit"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                                <v-btn @click="updateInfo(email, phoneNumber, description, address)" :disabled="!valid" rounded color="primary">Cập nhật thông tin</v-btn>
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
export default {
    data(){
        return{
            file: null,
            avatar: null,
            valid: false,
            name: '',
            role: '',
            email: '',
            dateOfBirth: '',
            dateMenu: false,
            phoneNumber: '',
            gender: "0",
            description: null,
            specialty: null,
            emailRules: [
                v => !!v || 'Chưa nhập E-mail',
                v => /.+@.+/.test(v) || 'E-mail không đúng định dạng',
            ],
            noEmptyRules: [
                v => !!v || 'Không được để trống',
            ],
            phoneRules: [
                v => /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\\./0-9]*$/g.test(v) || 'Không được để trống và chỉ được nhập số',
            ]
        }
    },
    methods: {
        checkString(str){
            return (str != null & str != undefined) ? str : '_'
        },
        getInfo(){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang lấy thông tin cho người dùng...')
            let url = `${config.userUrl}`
            apiService.getApi(url).then(result=> {
                // console.log(result)
                let data = result.data;
                this.name = data.name
                this.email = data.email;
                this.gender = data.gender.toString()
                this.dateOfBirth = data.dateOfBirth.split("-").reverse().join("-");
                this.phoneNumber = data.phoneNumber;
                this.role = data.role
                this.avatar = data.avatar
                if(data.description){
                    this.description = data.description;
                }
                if(data.specialty){
                    this.specialty = data.specialty;
                }
            }).catch(error => {
                alert(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        returnRole(role){
            let result = '';
            switch(role){
                case 'PATIENT':
                    result = 'Bệnh nhân';
                    break;
                case 'PRACTITIONER':
                    result = 'Bác sĩ đa khoa';
                    break;
                case 'SPECIALIST':
                    result = 'Bác sĩ chuyên khoa';
                    break;
                case 'DIETITIAN':
                    result = 'Bác sĩ dinh dưỡng';
                    break;
                case 'COORDINATOR':
                    result = 'ĐIỀU PHỐI VIÊN';
                    break;
                default:
                    result = '';
                    break;
            }
            return result
        },
        updateInfo(email, phone, description, address){
            let params = {
                email: email,
                phone: phone
            }
            if(description){
                params.description = description
            }
            if (address){
                params.address = address
            }
            let url = `${config.userUrl}`
            apiService.putApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Cập nhật thông tin thành công'})
                    this.getInfo()
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
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
                console.log(result)
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Cập nhật ảnh đại diện thành công'})
                    this.avatar = result.data
                    this.file = null;
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        }
    },
    created(){
        this.getInfo()
    }
}
</script>
<style scoped>

</style>