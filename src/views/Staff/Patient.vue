<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Patient detail here {{idPatient}}</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col xl="12">
                <h1>Thông tin cơ bản</h1>
                <v-card class="elevation-4" v-if="0">
                    <v-card-text>
                        <v-form v-model="valid">
                            <v-row>
                                <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                    <v-text-field :rules="noEmptyRules" v-model="name" label="Tên người dùng"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                    <v-text-field readonly v-model="role" label="Vị trí"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                    <v-text-field v-model="email" :rules="emailRules" label="Email"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col xs="12" sm="12" md="8" lg="8" xl="8">
                                    <v-text-field v-model="phoneNumber" :rules="phoneRules" label="Số điện thoại"></v-text-field>
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
                                    <v-menu
                                        ref="menu"
                                        v-model="dateMenu"
                                        :close-on-content-click="false"
                                        :return-value.sync="dateOfBirth"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="290px"
                                        >
                                        <template v-slot:activator="{ }">
                                            <v-text-field
                                                v-model="dateOfBirth"
                                                label="Ngày sinh"
                                                prepend-icon="event"
                                                readonly
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="dateOfBirth" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
                                        <v-btn text color="primary" @click="$refs.menu.save(dateOfBirth)">OK</v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-row>
                            <v-col>
                                <v-btn :disabled="!valid" rounded color="primary">Cập nhật thông tin</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                <h1>Các yêu cầu xin tư vấn</h1>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import apiService from '../../services/api.service'
import config from '../../config'
export default {
    props: {
        idPatient: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            valid: false,
            name: '',
            role: '',
            email: '',
            dateOfBirth: '',
            dateMenu: false,
            phoneNumber: '',
            gender: "0",
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
        getPatient(id){
            let url = `${config.apiUrl}/patients/${id}`
            apiService.getApi(url).then(result => {
                console.log(result)
                let data = result.data;
                this.name = data.name
                this.email = data.email;
                this.gender = data.gender.toString()
                this.dateOfBirth = data.dateOfBirth.split("-").reverse().join("-");
                this.phoneNumber = data.phoneNumber;
                this.role = data.role
            }).catch(error => {
                this.$store.dispatch('turnOnAlert', {color: 'error', message: error.toString()})
            })
        }
    },
    created(){
        this.getPatient(this.idPatient)
    }
}
</script>
<style scoped>

</style>