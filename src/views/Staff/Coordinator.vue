<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Coordinator here</h1>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col xs="12" md="12" sm="12" lg="12" xl="12">
                <h2>
                    Danh sách nhân viên 
                    <v-icon v-show="showDoctor == false" @click="showDoctor = true">keyboard_arrow_down</v-icon>
                    <v-icon v-show="showDoctor == true" @click="showDoctor = false">keyboard_arrow_up</v-icon>
                </h2>
                <v-data-table v-show="showDoctor" :headers="doctorHeaders" :items="allDoctors" class="elevation-4">
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
                                        <v-list-item v-on="on"><v-list-item-title>Xóa bác sĩ</v-list-item-title></v-list-item>
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
                <h2>Danh sách các chuyên môn</h2>
                <v-dialog v-model="createSpec.dialog" persistent max-width="70%">
                    <template v-slot:activator="{ on }">
                        <br>
                        <v-btn color="primary" dark v-on="on">Tạo chuyên môn</v-btn>
                        <br>
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
                        <v-btn color="blue darken-1" :disabled="createSpec.name == '' || createSpec.detail == ''" text @click="createSpecialty(createSpec.name, createSpec.detail)">TẠO</v-btn>
                        <v-btn color="red" text @click="createSpec.dialog = false">ĐÓNG</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <br>
                <v-data-table class="elevation-4" :headers="specHeaders" :items="specialties">
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
                        <v-btn color="blue darken-1" :disabled="specDetail.name == '' || specDetail.detail == ''" text @click="updateSpec(specDetail.name, specDetail.detail, specDetail.id)">SỬA</v-btn>
                        <v-btn color="red" text @click="specDetailDialog = false">ĐÓNG</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col xs="12" md="12" sm="12" lg="12" xl="12">
                <h2>Danh sách bệnh nhân</h2>
                <v-data-table :headers="patientHeaders" :items="allPatients" class="elevation-4">
                    <template v-slot:item.more="{ item }">
                        <a @click="goToPatientPage(item.id)">Xem chi tiết</a>
                    </template>
                </v-data-table>
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
                { text: 'XEM CHI TIẾT', value: 'more', align: 'start' },
            ],
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
            if(type){
                params.type = type
            }
            let url = `${config.apiUrl}/doctors`
            apiService.getApi(url, params).then(result => {
                this.updateDoctorsArrayFromServer(result.data)
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
                console.log(result)
                this.responseText = result
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
                console.log(result)
                this.getSpecialties()
            }).catch(error => {
                alert(error)
            })
        },
        openSpecDetailDialog(number){
            this.specDetail = Object.assign({}, this.specialties[number])
            this.specDetailDialog = true;
        },
        updateSpec(name, detail, id){
            console.log(name)
            console.log(detail)
            console.log(id)
            this.specDetailDialog = false;
        },
        getAllPatients(page, size){
            let params = {
                page: page,
                size: size,
            }
            let url = `${config.apiUrl}/patients`
            apiService.getApi(url, params).then(result => {
                console.log(result)
                this.updatePatients(result.data)
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
        }
    },
    created(){
        // this.getAllDoctorFromServer(1, 10)
        this.getAllPatients(1, 10)
    }
}
</script>
<style scoped>

</style>