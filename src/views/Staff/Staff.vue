<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>All staff here</h1>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col xs="12" md="12" sm="12" lg="12" xl="12">
                <h3>Danh sách nhân viên</h3>
                <v-data-table :headers="doctorHeaders" :items="allDoctors" class="elevation-1">
                    <template v-slot:item.more="{ item }">
                        <a @click="openDoctorDetailDialog(item.number)">{{item.more}}</a>
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
    </v-container>
</template>
<script>
import apiService from '../../services/api.service'
import config from '../../config'
export default {
    data(){
        return {
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
            allDoctors: [
                [
                    {
                        "id": 1,
                        "name": "Bác s? ?a khoa 01",
                        "email": "pra01@mail.com",
                        "gender": 0,
                        "dateOfBirth": "31-12-1980",
                        "phoneNumber": "01567135178",
                        "avatar": null,
                        "createdAt": [
                            2020,
                            3,
                            20,
                            12,
                            50,
                            25
                        ],
                        "description": null,
                        "specialties": null
                    },
                    {
                        "id": 11,
                        "name": "?i?u ph?i viên: QA",
                        "email": "anhpq.adsplus@gmail.com",
                        "gender": 0,
                        "dateOfBirth": "31-10-1998",
                        "phoneNumber": "023423325",
                        "avatar": null,
                        "createdAt": [
                        2020,
                        3,
                        23,
                        8,
                        6,
                        15
                        ]
                    },
                    {
                        "id": 10,
                        "name": "Bác s? chuyên khoa: QA",
                        "email": "20165755@student.hust.edu.vn",
                        "gender": 0,
                        "dateOfBirth": "31-10-1998",
                        "phoneNumber": "0982485423",
                        "avatar": null,
                        "createdAt": [
                        2020,
                        3,
                        23,
                        8,
                        3,
                        51
                        ],
                        "description": null,
                        "specialty": null
                    },
                    {
                        "id": 3,
                        "name": "Bác s? dinh d??ng 01",
                        "email": "die01@mail.com",
                        "gender": 1,
                        "dateOfBirth": "09-03-1984",
                        "phoneNumber": "0466881682",
                        "avatar": null,
                        "createdAt": [
                        2020,
                        3,
                        20,
                        12,
                        50,
                        28
                        ],
                        "description": null,
                        "specialty": null
                    }
                ]
            ],
            doctorHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'EMAIL', value: 'email', align: 'start' },
                { text: 'GIỚI TÍNH', value: 'gender', align: 'start' },
                { text: 'XEM CHI TIẾT', value: 'more', align: 'start' },
                // { text: 'NGÀY SINH', value: 'dateOfBirth', align: 'start', sortable: false },
                // { text: 'GHI CHÚ', value: 'description', align: 'start', sortable: false },
                // { text: 'CHUYÊN MÔN', value: 'specialty', align: 'start', sortable: false },
            ]
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
                console.log(result)
                this.updateDoctors(result.data)
            }).catch(error => {
                console.log(error)
            })
        },
        updateDoctors(doctorArray){
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
            this.doctorDetail = this.allDoctors[number]
            this.doctorDetailDialog = true
        }
    },
    created(){
        this.getAllDoctorFromServer(1, 10)
    }

}
</script>
<style scoped>

</style>