<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Coordinator here</h1>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col xs="12" sm="12" md="3" lg="3" xl="3">
                <h2>
                    Danh sách nhân viên 
                    <v-icon v-show="showDoctor == false" @click="showDoctor = true">keyboard_arrow_down</v-icon>
                    <v-icon v-show="showDoctor == true" @click="showDoctor = false">keyboard_arrow_up</v-icon>
                </h2>
                <v-select
                    v-show="showDoctor"
                    :items="doctorTypes"
                    v-model="doctorType"
                    label="Chọn loại nhân viên"
                ></v-select>
                
            </v-col>
            <v-col v-show="showDoctor" xs="12" sm="12" md="12" lg="12" xl="12">
                <v-data-table :headers="doctorHeaders" :items="allDoctors" class="elevation-4">
                    <template v-slot:item.more="{ item }">
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">more_vert</v-icon>
                            </template>
                            <v-list>
                                <v-list-item
                                    @click="openDoctorDetailDialog(item.number)"
                                    >
                                    <v-list-item-title>Xem chi tiết</v-list-item-title>
                                </v-list-item>
                                <v-dialog
                                    v-model="deleteDoctorDialog"
                                    width="500"
                                    >
                                    <template v-slot:activator="{ on }">
                                        <v-list-item v-on="on"><v-list-item-title>Xóa nhân viên</v-list-item-title></v-list-item>
                                    </template>

                                    <v-card>
                                        <v-card-title
                                            class="headline red"
                                            primary-title
                                            dark
                                            >
                                            Xác nhận xóa
                                        </v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-text>
                                            <v-divider></v-divider>
                                            Bạn có chắc chắn muốn xóa
                                        </v-card-text>

                                        <v-divider></v-divider>

                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            color="red"
                                            text
                                            @click="deleteDoctor(item.id)"
                                            >
                                            XÓA
                                        </v-btn>
                                        <v-btn
                                            color="primary"
                                            text
                                            @click="deleteDoctorDialog = false"
                                            >
                                            ĐÓNG
                                        </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                    
                            </v-list>
                        </v-menu>
                    </template>
                    <!-- <template v-slot:item.gender="{ item }">
                        {{checkGender(item.gender)}}
                    </template> -->
                </v-data-table>
                <br>
                <div class="text-center">
                    <v-pagination
                        v-model="doctorPage"
                        :length="doctorPages"
                    ></v-pagination>
                </div>
                <v-dialog v-model="doctorDetailDialog" width="70%">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Thông tin chi tiết</span>
                        </v-card-title>
                        <v-card-text>
                        <v-container>
                            <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field readonly label="Tên" v-model="doctorDetail.name"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field readonly label="Ngày sinh" v-model="doctorDetail.dateOfBirth" ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    readonly 
                                    label="Giới tính"
                                    v-model="doctorDetail.gender"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field readonly label="Email" v-model="doctorDetail.email"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field readonly label="Ghi chú" v-model="doctorDetail.description"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field readonly label="Chuyên môn" v-model="doctorDetail.specialty"></v-text-field>
                            </v-col>
                            </v-row>
                        </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red" text @click="doctorDetailDialog = false">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                <h2>
                    Danh sách các chuyên môn
                    <v-icon v-show="showSpec == false" @click="showSpec = true">keyboard_arrow_down</v-icon>
                    <v-icon v-show="showSpec == true" @click="showSpec = false">keyboard_arrow_up</v-icon>
                </h2>
                <v-dialog v-model="createSpec.dialog" persistent max-width="70%">
                    <template v-slot:activator="{ on }">
                        <v-btn v-show="showSpec" color="primary" dark v-on="on"> <v-icon>add</v-icon> Tạo chuyên môn</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Thông tin chuyên môn mới</span>
                        </v-card-title>
                        <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="createSpec.name" label="Tên chuyên môn"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="createSpec.detail" label="Mô tả chuyên môn"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" :disabled="createSpec.name == '' || createSpec.detail == ''" text @click="createSpecialty(createSpec.name, createSpec.detail), createSpec.dialog = false">TẠO</v-btn>
                        <v-btn color="red" text @click="createSpec.dialog = false">ĐÓNG</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <br>
                <v-data-table v-show="showSpec" class="elevation-4" :headers="specHeaders" :items="specialties">
                    <template v-slot:item.more="{ item }">
                        <a @click="openSpecDetailDialog(item.number)">{{item.more}} <v-icon>create</v-icon>   </a>
                    </template>
                </v-data-table>
                <v-dialog offset-y persistent v-model="specDetailDialog" width="60%">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Sửa chuyên môn</span>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="specDetail.name" label="Tên chuyên môn"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="specDetail.detail" label="Mô tả chuyên môn"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" :disabled="specDetail.name == '' || specDetail.detail == ''" text @click="specDetailDialog = false, updateSpec(specDetail.name, specDetail.detail, specDetail.id)">SỬA</v-btn>
                        <v-btn color="red" text @click="specDetailDialog = false">ĐÓNG</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col xs="12" md="12" sm="12" lg="12" xl="12">
                <h2>Danh sách bệnh nhân chưa có bác sĩ quản lý</h2>
                <v-data-table :headers="patientHeaders" :items="allPatients" class="elevation-4">
                    <template v-slot:item.more="{}">
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">more_vert</v-icon>
                            </template>
                            <v-list>
                                <v-list-item>
                                    <v-list-item-title>Xem chi tiết</v-list-item-title>
                                </v-list-item>
                                <v-list-item><v-list-item-title>Gán cho bác sĩ đa khoa</v-list-item-title></v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-row>
            <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                <v-dialog scrollable v-model="registerObj.dialog" max-width="700px" persistent>
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark v-on="on">Đăng ký tài khoản</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            Đăng ký tài khoản vào hệ thống ABCLINIC
                        </v-card-title>
                        <v-card-text>
                            <v-form v-model="registerObj.valid">
                                <v-row wrap>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-text-field :rules="noEmptyRules" v-model="registerObj.name" label="Tên người dùng"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-text-field v-model="registerObj.email" :rules="emailRules" label="Email"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-text-field v-model="registerObj.phoneNumber" :rules="phoneRules" label="Số điện thoại"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-menu
                                            ref="menu"
                                            v-model="registerObj.dateMenu"
                                            :close-on-content-click="false"
                                            :return-value.sync="registerObj.dateOfBirth"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="290px"
                                            >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    v-model="registerObj.dateOfBirth"
                                                    label="Ngày sinh"
                                                    prepend-icon="event"
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="registerObj.dateOfBirth" no-title scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn text color="primary" @click="registerObj.dateMenu = false">Cancel</v-btn>
                                            <v-btn text color="primary" @click="$refs.menu.save(registerObj.dateOfBirth)">OK</v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                                <v-row row wrap>
                                    <v-col xs="12" sm="12" md="6" lg="6" xl="6">
                                        Giới tính
                                        <v-radio-group v-model="registerObj.gender" row>
                                            <v-radio label="Nam" value="0"></v-radio>
                                            <v-radio label="Nữ" value="1"></v-radio>
                                            <v-radio label="Khác" value="2"></v-radio>
                                        </v-radio-group>
                                    </v-col>
                                    <v-col xs="12" sm="12" md="6" lg="6" xl="6">
                                        Chức vụ
                                        <v-select v-model="registerObj.role" :items="registerObj.roles"></v-select>
                                    </v-col>
                                </v-row>
                                <v-row >
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">>
                                        <v-text-field
                                            v-model="registerObj.password"
                                            label="Mật khẩu"
                                            :rules="noEmptyRules"
                                            type="password"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" :disabled="!registerObj.valid" text @click="registerObj.dialog = false, register(registerObj.name, registerObj.email, registerObj.phoneNumber, registerObj.dateOfBirth, registerObj.gender, registerObj.role, registerObj.password)">ĐĂNG KÝ</v-btn>
                            <v-btn color="red" text @click="registerObj.dialog = false">ĐÓNG</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import apiService from '../../services/api.service'
import config from '../../config'
export default {
    data(){
        return {
            doctorPages: 2,
            doctorPage: 1,
            doctorPageSize: 10,
            doctorTypes: [
                {
                    text: 'Tất cả',
                    value: null
                },
                {
                    text: 'Đa khoa',
                    value: 0
                },
                {
                    text: 'Chuyên khoa',
                    value: 1
                },
                {
                    text: 'Dinh dưỡng',
                    value: 2
                },
                {
                    text: 'Điều phối viên',
                    value: 3
                },
            ],
            doctorType: null,
            responseText: 'Try something',
            showDoctor: false,
            doctorDetailDialog: false,
            doctorDetail: {
                number: 0,
                id: '',
                name: '',
                email: '',
                gender: '',
                more: 'Xem chi tiết',
                dateOfBirth: '',
                description: '',
                specialty: ''
            },
            allDoctors: [],
            doctorHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'EMAIL', value: 'email', align: 'start' },
                { text: 'GIỚI TÍNH', value: 'gender', align: 'start' },
                { text: 'HÀNH ĐỘNG', value: 'more', align: 'right' },
            ],
            specialties: [
                {
                    number: 0,
                    id: 100,
                    name: 'Răng hàm mặt',
                    detail: 'Tottri, tốt cho người bị bệnh trĩ',
                    more: 'Sửa'
                }
            ],
            specDetail: {
                number: 0,
                id: 0,
                name: 'abc',
                detail: 'xyz',
                more: 'bla bla'
            },
            specDetailDialog: false,
            specHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'MÔ TẢ', value: 'detail', align: 'start' },
                { text: 'HÀNH ĐỘNG', value: 'more', align: 'right' },
            ],
            createSpec: {
                dialog: false,
                name: '',
                detail: ''
            },
            showSpec: false,
            deleteDoctorDialog: false,
            allPatients: [
                {
                    "id": 5,
                    "name": "B?nh nhân 01",
                    "avatar": null
                },
            ],
            patientHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'CHỌN HÀNH ĐỘNG', value: 'more', align: 'end' },
            ],
            registerObj: {
                dateOfBirth: '',
                dateMenu: false,
                valid: false,
                dialog: false,
                email: '',
                gender: "0",
                name: '',
                password: '',
                phoneNumber: '',
                role: 4,
                roles: [
                {
                    text: 'Đa khoa',
                    value: 0
                },
                {
                    text: 'Chuyên khoa',
                    value: 1
                },
                {
                    text: 'Dinh dưỡng',
                    value: 2
                },
                {
                    text: 'Điều phối viên',
                    value: 3
                },
                {
                    text: 'Bệnh nhân',
                    value: 4
                }
            ],
            },
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
    watch: {
        doctorType(){
            this.getAllDoctorFromServer(this.doctorPage, this.doctorPageSize, this.doctorType)
        },
        doctorPage(){
            this.getAllDoctorFromServer(this.doctorPage, this.doctorPageSize, this.doctorType)
        }
    },
    methods: {
        checkGender(number){
            switch(number){
                case 0: 
                    return 'Nam'
                case 1:
                    return 'Nữ'
                case 2:
                    return 'Khác'
            }
        },
        checkString(str){
            return (str != null & str != undefined) ? str : '_'
        },
        getAllDoctorFromServer(page, size, type){
            let params = {
                page: page,
                size: size,
            }
            if(type != null && type != undefined){
                params.type = type
            }
            let url = `${config.apiUrl}/doctors`
            apiService.getApi(url, params).then(result => {
                // console.log(result)
                if(result.status.toString()[0] === "2"){
                    this.updateDoctorsArrayFromServer(result.data)
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            })
        },
        updateDoctorsArrayFromServer(doctorArray){
            this.allDoctors = []
            for(let i = 0; i < doctorArray.length; i++){
                let obj = {
                    number: i,
                    id: this.checkString(doctorArray[i].id.toString()),
                    name: this.checkString(doctorArray[i].name),
                    email: this.checkString(doctorArray[i].email),
                    gender: this.checkGender(this.checkString(doctorArray[i].gender)),
                    more: 'Xem chi tiết',
                    dateOfBirth: this.checkString(doctorArray[i].dateOfBirth),
                    description: this.checkString(doctorArray[i].description),
                    specialty: this.checkString(doctorArray[i].specialty)
                }
                // console.log(obj)
                this.allDoctors.push(obj)
            }
        },
        openDoctorDetailDialog(number){
            // console.log(number)
            this.doctorDetail = Object.assign({}, this.allDoctors[number])
            this.doctorDetailDialog = true
        },
        deleteDoctor(id){
            let url = `${config.apiUrl}/doctors`
            let params = {
                id: id
            }
            apiService.deleteApi(url, params).then(result => {
                console.log(result)
                this.getAllDoctorFromServer(1, 10)
            }).catch(error => {
                alert(error)
            })
            this.deleteDoctorDialog = false
        },
        getSpecialties(){
            let url = `${config.apiUrl}/specialties`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.updateSpecialtiesFromServer(result.data)
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            })
        },
        updateSpecialtiesFromServer(specArray){
            this.specialties = specArray;
        },
        createSpecialty(name, detail){
            let url = `${config.apiUrl}/specialties`
            let params = {
                name: name,
                detail: detail
            }
            apiService.postApiParams(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Tạo chuyên môn thành công'})
                    this.getSpecialties()
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                alert(error)
            })
        },
        openSpecDetailDialog(number){
            this.specDetail = Object.assign({}, this.specialties[number])
            this.specDetailDialog = true;
        },
        updateSpec(name, detail, id){
            let url = `${config.apiUrl}/specialties`
            let params = {
                name: name,
                detail: detail,
                id: id
            }
            apiService.putApi(url, params).then(result => {
                console.log(result)
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Sửa chuyên môn thành công'})
                    this.getSpecialties()
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            })
            // this.specDetailDialog = false;
        },
        getAllPatients(page, size, type){
            let params = {
                page: page,
                size: size,
            }
            if(type != null && type != undefined){
                params.type = type
            }
            let url = `${config.apiUrl}/patients`
            apiService.getApi(url, params).then(result => {
                console.log(result)
                if(result.status.toString()[0] === "2"){
                    this.updatePatients(result.data)
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
                
            }).catch(error => {
                console.log(error)
            })
        },
        updatePatients(patArray){
            this.allPatients = patArray;
        },
        goToPatientPage(id){
            let url = `/patient/${id}`
            this.$router.push(url)
        },
        register(name, email, phone, dob, gender, role, password){
            let params = {
                name: name,
                email: email,
                phone: phone,
                dob: dob.split("-").reverse().join("/"),
                gender: parseInt(gender, 10),
                role: role,
                password: password
            }
            let url = `${config.authUrl}/sign_up`
            apiService.postApiParams(url, params).then(result => {
                console.log(result)
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Tạo tài khoản thành công'})
                    if(role == 4){
                        this.getAllPatients(1, 10)
                    }
                    else {
                        this.doctorType = null;
                        this.doctorPage = 1;
                    }
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            })
        }
    },
    created(){
        this.registerObj.dateOfBirth = new Date().toISOString().substr(0, 10)
        // this.getSpecialties()
        // this.getAllDoctorFromServer(this.doctorPage, this.doctorPageSize, this.doctorType)
        this.getAllPatients(1, 10)
    }
}
</script>
<style scoped>

</style>