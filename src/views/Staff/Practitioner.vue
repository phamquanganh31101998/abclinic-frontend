<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Practitioner here</h1>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col xs="12" md="12" sm="12" lg="12" xl="12">
                <h2>Danh sách bệnh nhân quản lý</h2>
                <v-data-table :headers="patientHeaders" :items="allPatients" class="elevation-4">
                    <template v-slot:item.more="{ item }">
                        <a @click="goToPatientPage(item.id)">Xem chi tiết</a>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col xs="12" md="12" sm="12" lg="12" xl="12">
                <h2>Danh sách yêu cầu xin tư vấn</h2>
                <!-- <v-data-table :headers="patientHeaders" :items="allPatients" class="elevation-4">
                    <template v-slot:item.more="{ item }">
                        <a @click="goToPatientPage(item.id)">Xem chi tiết</a>
                    </template>
                </v-data-table> -->
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
            allPatients: [],
            patientHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'XEM CHI TIẾT', value: 'more', align: 'start' },
            ],
            allInquiry: [
                {
                    id: 1,
                    patient: {
                        id: 1,
                        name: 'Quang Anh'
                    },
                    content: 'Đau bụng quá huhu',
                    replies: [
                        {
                            id: 3,
                            name: 'Duc',
                            role: 'COORDINATOR',
                            reply: 'Câm mồm'
                        },
                        {
                            id: 1,
                            name: 'QA',
                            role: 'PATIENT',
                            reply: 'Cút'
                        },
                    ],
                    record: {
                        id: 1,
                        doctor_id: 5,
                        name: 'Lecter',
                        role: 'SPECIALIST',
                        diagnose: 'Viêm ngón tay',
                        note: 'Mỗi ngày uống 10 viên Berberin',
                        prescription: 'Berberin 10mg, 2 lọ. Mỗi lọ uống trong vòng 1 tuần'
                    }
                },
                {
                    id: 2,
                    patient: {
                        id: 2,
                        name: 'Tùng'
                    },
                    content: 'Cơ bắp yếu quá',
                    replies: [
                        {
                            id: 3,
                            name: 'Duc',
                            role: 'COORDINATOR',
                            reply: 'Em phải tập tạ nhiều vào nha'
                        },
                        {
                            id: 4,
                            name: 'BS dinh dưỡng Sơn Tùng MTP',
                            role: 'DIETITIAN',
                            reply: 'Ăn nhiều thịt bò nhé em'
                        },
                        {
                            id: 2,
                            name: 'Tùng',
                            role: 'PATIENT',
                            reply: 'Dạ em cảm ơn ạ'
                        },
                    ],
                    record: {
                        id: 2,
                        doctor_id: 4,
                        name: 'BS dinh dưỡng Sơn Tùng MTP',
                        role: 'DIETITIAN',
                        diagnose: 'Béo phì',
                        note: 'Ăn uống kết hợp sử dụng thực phẩm bổ sung',
                        prescription: 'Essential Protein lọ 500mg'
                    }
                }
            ]
        }
    },
    methods: {
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
        this.getAllPatients(1, 10)
    }
}
</script>
<style scoped>

</style>