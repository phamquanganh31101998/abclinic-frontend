<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Practitioner here</h1>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col  md="12" sm="12" lg="12" xl="12">
                <!-- <h2>
                    Danh sách bệnh nhân chưa có bác sĩ quản lý
                    <v-icon v-show="showPatient == false" @click="showPatient = true">keyboard_arrow_down</v-icon>
                    <v-icon v-show="showPatient == true" @click="showPatient = false">keyboard_arrow_up</v-icon>
                </h2> -->
                <v-data-table v-show="showPatient" :headers="patientHeaders" :items="allPatients" class="elevation-4" hide-default-footer>
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title><h3>Danh sách bệnh nhân</h3></v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.name="{item}">
                        <a @click="getPatientDetail(item.id, true)">{{item.name}}</a>
                    </template>
                    <template v-slot:item.more="{item}">
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">more_vert</v-icon>
                            </template>
                            <v-list>
                                <v-list-item @click="getPatientDetail(item.id, true)">
                                    <v-list-item-title>Xem chi tiết</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="getPatientDetail(item.id, false)"><v-list-item-title>Gán bệnh nhân</v-list-item-title></v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                </v-data-table>
                <br>
                <div class="text-center">
                    <v-pagination
                        v-model="patientPage"
                        :length="patientPages"
                    ></v-pagination>
                </div>
                <v-dialog scrollable v-model="patientDetailDialog" max-width="700px" persistent>
                    <v-card>
                        <v-card-title
                            class="headline grey lighten-2"
                            primary-title
                            >
                            Chi tiết bệnh nhân
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12"  sm="12" md="6" lg="6" xl="3">
                                        <v-text-field readonly label="ID" v-model="patientDetail.id"></v-text-field>
                                    </v-col>
                                    <v-col cols="12"  sm="12" md="6" lg="6" xl="3">
                                        <v-text-field readonly label="Tên" v-model="patientDetail.name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12"  sm="12" md="6" lg="6" xl="3">
                                        <v-text-field readonly label="Ngày sinh" v-model="patientDetail.dateOfBirth"></v-text-field>
                                    </v-col>
                                    <v-col cols="12"  sm="12" md="6" lg="6" xl="3">
                                        <v-text-field readonly label="Giới tính" v-model="patientDetail.gender"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field readonly label="Email" v-model="patientDetail.email"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field readonly label="Số điện thoại" v-model="patientDetail.phoneNumber"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col  sm="12" md="12" lg="12" xl="12">
                                        <v-data-table
                                            hide-default-footer
                                            :headers="inquiryHeaders"
                                            :items="patientDetail.inquiries"
                                            single-expand
                                            show-expand
                                            class="elevation-4"
                                            >
                                            <template v-slot:top>
                                                <v-toolbar flat>
                                                    <v-toolbar-title>Danh sách yêu cầu tư vấn</v-toolbar-title>
                                                    <v-spacer></v-spacer>
                                                </v-toolbar>
                                            </template>
                                            <template v-slot:item.patient="{ item }">
                                                {{ item.patient.name }}
                                            </template>
                                            <template v-slot:item.type="{ item }">
                                                {{ returnInquiryType(item.type) }}
                                            </template>
                                            <template v-slot:expanded-item="{ item }">
                                                <td :colspan="inquiryHeaders.length"><b>Yêu cầu tư vấn: {{ item.content }}</b> </td>
                                            </template>
                                        </v-data-table>
                                    </v-col>
                                    
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red" text @click="patientDetailDialog = false">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog scrollable v-model="assignToPracDialog" max-width="700px" persistent>
                    <v-card>
                        <v-card-title
                            class="headline grey lighten-2"
                            primary-title
                            >
                            Gán quyền quản lý bệnh nhân cho Bác sĩ chuyên khoa/dinh dưỡng
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col  sm="12" md="12" lg="12" xl="12">
                                        <v-data-table
                                            hide-default-footer
                                            v-model="selectedInquiry"
                                            :headers="inquiryHeaders"
                                            :items="patientDetail.inquiries"
                                            single-expand
                                            show-expand
                                            single-select
                                            show-select
                                            class="elevation-4"
                                            >
                                            <template v-slot:top>
                                                <v-toolbar flat>
                                                    <v-toolbar-title>Chọn yêu cầu tư vấn</v-toolbar-title>
                                                    <v-spacer></v-spacer>
                                                </v-toolbar>
                                            </template>
                                            <template v-slot:item.type="{ item }">
                                                {{ returnInquiryType(item.type) }}
                                            </template>
                                            <template v-slot:item.patient="{ item }">
                                                {{ item.patient.name }}
                                            </template>
                                            <template v-slot:expanded-item="{ item }">
                                                <td :colspan="inquiryHeaders.length"><b>Yêu cầu tư vấn: {{ item.content }}</b> </td>
                                            </template>
                                        </v-data-table>
                                    </v-col>
                                    <v-col  sm="12" md="12" lg="12" xl="12">
                                        <v-data-table
                                            hide-default-footer
                                            v-model="selectedDoctor"
                                            :headers="doctorHeaders"
                                            :items="selectableDoctor"
                                            show-select
                                            class="elevation-4"
                                            >
                                            <template v-slot:top>
                                                <v-toolbar flat>
                                                    <v-toolbar-title>{{selectDoctorTitle}}</v-toolbar-title>
                                                    <v-spacer></v-spacer>
                                                </v-toolbar>
                                            </template>
                                        </v-data-table>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue" text :disabled="selectedInquiry.length == 0 || selectedDoctor == 0" @click="assignToPrac(patientDetail.id, selectedInquiry, selectedDoctor), assignToPracDialog = false">GÁN</v-btn>
                            <v-btn color="red" text @click="assignToPracDialog = false">QUAY LẠI</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row wrap row class="fill-height">
            <v-col cols="12" md="12" sm="12" lg="6" xl="6">
                <v-card class="elevation-4">
                    <v-card-title>
                        <h3>Thông tin chi tiết bệnh nhân</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                                <v-row>
                                    <v-col cols="12"  sm="12" md="6" lg="4" xl="4">
                                        <v-text-field readonly label="ID" v-model="patientDetail.id"></v-text-field>
                                    </v-col>
                                    <v-col cols="12"  sm="12" md="6" lg="4" xl="4">
                                        <v-text-field readonly label="Tên" v-model="patientDetail.name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12"  sm="12" md="6" lg="4" xl="4">
                                        <v-text-field readonly label="Ngày sinh" v-model="patientDetail.dateOfBirth"></v-text-field>
                                    </v-col>
                                    <v-col cols="12"  sm="12" md="6" lg="4" xl="4">
                                        <v-text-field readonly label="Giới tính" v-model="patientDetail.gender"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6" lg="4" xl="4">
                                        <v-text-field readonly label="Email" v-model="patientDetail.email"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6" lg="4" xl="4">
                                        <v-text-field readonly label="Số điện thoại" v-model="patientDetail.phoneNumber"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                        <h3>Bác sĩ đa khoa phụ trách: {{patientDetail.practitioner.name}}</h3>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                        <h3>Bác sĩ chuyên khoa phụ trách:</h3>
                                        <h3 :key="doctor.id" v-for="doctor in patientDetail.specialist"> - {{doctor.name}}</h3>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                        <h3>Bác sĩ dinh dưỡng phụ trách:</h3>
                                        <h3 :key="doctor.id" v-for="doctor in patientDetail.dietitian"> - {{doctor.name}}</h3>
                                    </v-col>
                                </v-row>
                            </v-container>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="12" sm="12" lg="6" xl="6">
                <v-card class="elevation-4" style="height: 100%">
                    <v-card-title>
                        <h3>Yêu cầu tư vấn</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table show-expand hide-default-footer class="elevation-4" :items="patientDetail.inquiries" :headers="inquiryHeaders">
                            <template v-slot:item.patient="{ item }">
                                {{item.patient.name}}
                            </template>
                            <template v-slot:item.type="{ item }">
                                {{ returnInquiryType(item.type) }}
                            </template>
                            <template v-slot:expanded-item="{ item }">
                                <td :colspan="inquiryHeaders.length">
                                    <br>
                                    <h2>Nội dung yêu cầu tư vấn: {{ item.content }}</h2> 
                                    <br>
                                    <a @click.stop="getDetailInquiry(item.id)"></a>
                                </td>
                            </template>
                        </v-data-table>
                    </v-card-text>  
                </v-card>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col cols="12">
                <v-card class="elevation-4">
                    <v-card-title><h3>Chi tiết yêu cầu tư vấn</h3></v-card-title>
                    <v-card-text v-if="detailInquiry != null">
                            <v-row>
                                <v-col v-for="(record, index) in detailInquiry.inquiry.medicalRecords" :key="record.id" cols="12" sm="12" md="6" lg="6" xl="6">
                                    <v-card class="elevation-4">
                                        <v-card-title>Trả lời yêu cầu tư vấn</v-card-title>
                                        <v-card-text>
                                            Bác sĩ: {{record.specialist.name}}
                                            <br>
                                            Chức vụ: {{record.specialist.role}}
                                            <br>
                                            Chuyên môn: {{record.specialist.specialty.name}}
                                            <br>
                                            Chẩn đoán: {{record.diagnose}}
                                            <br>
                                            Kê đơn thuốc: {{record.prescription}}
                                            <br>
                                            Ghi chú: {{record.note}}
                                            <br>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" rounded @click="openEditRecordDialog(record.id, index, true)">Chỉnh sửa tư vấn</v-btn>
                                            
                                        </v-card-actions>
                                    </v-card>
                                </v-col>
                                <v-col v-for="(record, index) in detailInquiry.inquiry.dietRecords" :key="record.id" cols="12" sm="12" md="6" lg="6" xl="6">
                                    <v-card class="elevation-4">
                                        <v-card-title>Trả lời yêu cầu tư vấn</v-card-title>
                                        <v-card-text>
                                            Bác sĩ: {{record.dietitian.name}}
                                            <br>
                                            Chức vụ: {{record.dietitian.role}}
                                            <br>
                                            Chuyên môn: {{record.dietitian.specialty.name}}
                                            <br>
                                            Chẩn đoán: {{record.diagnose}}
                                            <br>
                                            Kê đơn thuốc: {{record.prescription}}
                                            <br>
                                            Ghi chú: {{record.note}}
                                            <br>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" rounded @click="openEditRecordDialog(record.id, index, false)">Chỉnh sửa tư vấn</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-col>
                            </v-row>
                        <br>
                        <v-card class="elevation-4">
                            <v-card-title>
                                Bình luận
                            </v-card-title>
                            <v-card-text>
                                <div :key="reply.id" v-for="reply in detailInquiry.inquiry.replies" style="margin: 10px; padding: 10px; border: 1px solid grey; border-radius: 10px;">
                                    <h4>{{reply.user.name}} ({{reply.user.role}}) </h4>
                                    <p>{{reply.content}}</p> 
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-textarea v-model="replyText" background-color="#CFD8DC" label="Thêm bình luận tại đây..." outlined rows="4"></v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-btn :disabled="replyText == ''" color="success" @click="addReply(detailInquiry.id, replyText)" >Bình luận</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                <br>
                            </v-card-actions>
                        </v-card>
                    </v-card-text>
                    <v-dialog max-width="700px" v-model="editRecord.dialog" persistent>
                        <v-card class="elevation-4" v-if="editRecord.obj != null">
                            <v-card-title
                                class="headline grey lighten-2"
                                primary-title
                                >
                                Chỉnh sửa tư vấn 
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-textarea rows="2" v-model="editRecord.obj.diagnose" label="Chẩn đoán"></v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-textarea rows="2" v-model="editRecord.obj.prescription" label="Đơn thuốc"></v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-textarea rows="2" v-model="editRecord.obj.note" label="Ghi chú"></v-textarea>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue" :disabled="editRecord.obj.diagnose == '' || editRecord.obj.prescription == ''|| editRecord.obj.note ==''" text @click="updateRecord(editRecord.inquiryId, editRecord.inquiryIndex, editRecord.isMedical, editRecord.obj.diagnose, editRecord.obj.prescription, editRecord.obj.note), editRecord.dialog = false, editRecord.obj = null">Sửa</v-btn>
                                <v-btn color="red" text @click="editRecord.dialog = false, editRecord.obj = null">Đóng</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card>
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
            allPatients: [
                {
                    "id": 16,
                    "role": "PATIENT",
                    "name": "Trần Tuấn Thành",
                    "age": 22
                },
            ],
            patientHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'TUỔI', value: 'age', align: 'start' },
                { text: 'CHỌN HÀNH ĐỘNG', value: 'more', align: 'end' },
            ],
            patientPage: 1,
            patientPageSize: 10,
            patientPages: 0,
            showPatient: true,
            patientDetailDialog: false,
            patientDetail: {
                dateOfBirth: '',
                createdDate: '',
                email: '',
                gender: '',
                id: 0,
                inquiries: [],
                name: '',
                phoneNumber: '',
                practitioner: {},
                specialist: [],
                dietitian: [],
            },
            assignToPracDialog: false,
            inquiryHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN BỆNH NHÂN', value: 'patient', align: 'start' },
                { text: 'KIỂU YÊU CẦU', value: 'type', align: 'start' },
                { text: '', value: 'data-table-expand' },
            ],
            detailInquiry: {
                "id": 0,
                "inquiry": {
                    "album": [
                    "string"
                    ],
                    "albumId": "string",
                    "content": "string",
                    "createdAt": "2020-05-06T03:05:01.832Z",
                    "dietRecords": [
                        {
                            "createdAt": "2020-05-06T03:05:01.832Z",
                            "dietitian": {
                            "age": 0,
                            "avatar": "string",
                            "createdAt": "2020-05-06T03:05:01.832Z",
                            "dateOfBirth": "string",
                            "description": "string",
                            "email": "string",
                            "gender": 0,
                            "id": 0,
                            "name": "string",
                            "password": "string",
                            "patients": [
                                null
                            ],
                            "phoneNumber": "string",
                            "role": "PRACTITIONER",
                            "specialty": {
                                "detail": "string",
                                "id": 0,
                                "name": "string"
                            },
                            "status": 0,
                            "updatedAt": "2020-05-06T03:05:01.832Z"
                            },
                            "id": 1,
                            "note": "string",
                            "prescription": "string",
                            "recordType": 0,
                            "status": 0,
                            "updatedAt": "2020-05-06T03:05:01.832Z"
                        }
                    ],
                    "id": 0,
                    "medicalRecords": [
                        {
                            "createdAt": "2020-05-06T03:05:01.832Z",
                            "diagnose": "string",
                            "disease": {
                                "description": "string",
                                "id": 0,
                                "name": "string"
                            },
                            "id": 2,
                            "note": "string",
                            "prescription": "string",
                            "recordType": 0,
                            "specialist": {
                            "age": 0,
                            "avatar": "string",
                            "createdAt": "2020-05-06T03:05:01.832Z",
                            "dateOfBirth": "string",
                            "description": "string",
                            "email": "string",
                            "gender": 0,
                            "id": 2,
                            "name": "string",
                            "password": "string",
                            "patients": [
                                null
                            ],
                            "phoneNumber": "string",
                            "role": "PRACTITIONER",
                            "specialty": {
                                "detail": "string",
                                "id": 0,
                                "name": "string"
                            },
                            "status": 0,
                            "updatedAt": "2020-05-06T03:05:01.832Z"
                            },
                            "status": 0,
                            "updatedAt": "2020-05-06T03:05:01.832Z"
                        }
                    ],
                    "patient": {
                    "address": "string",
                    "age": 0,
                    "avatar": "string",
                    "createdAt": "2020-05-06T03:05:01.832Z",
                    "dateOfBirth": "string",
                    "dietitians": [
                        {
                        "age": 0,
                        "avatar": "string",
                        "createdAt": "2020-05-06T03:05:01.832Z",
                        "dateOfBirth": "string",
                        "description": "string",
                        "email": "string",
                        "gender": 0,
                        "id": 0,
                        "name": "string",
                        "password": "string",
                        "patients": [
                            null
                        ],
                        "phoneNumber": "string",
                        "role": "PRACTITIONER",
                        "specialty": {
                            "detail": "string",
                            "id": 0,
                            "name": "string"
                        },
                        "status": 0,
                        "updatedAt": "2020-05-06T03:05:01.832Z"
                        }
                    ],
                    "email": "string",
                    "gender": 0,
                    "id": 0,
                    "inquiries": [
                        null
                    ],
                    "name": "string",
                    "password": "string",
                    "phoneNumber": "string",
                    "practitioner": {
                        "age": 0,
                        "avatar": "string",
                        "createdAt": "2020-05-06T03:05:01.832Z",
                        "dateOfBirth": "string",
                        "description": "string",
                        "email": "string",
                        "gender": 0,
                        "id": 0,
                        "name": "string",
                        "password": "string",
                        "patients": [
                        null
                        ],
                        "phoneNumber": "string",
                        "role": "PRACTITIONER",
                        "specialties": [
                        {
                            "detail": "string",
                            "id": 0,
                            "name": "string"
                        }
                        ],
                        "status": 0,
                        "updatedAt": "2020-05-06T03:05:01.832Z"
                    },
                    "role": "PRACTITIONER",
                    "specialists": [
                        {
                        "age": 0,
                        "avatar": "string",
                        "createdAt": "2020-05-06T03:05:01.832Z",
                        "dateOfBirth": "string",
                        "description": "string",
                        "email": "string",
                        "gender": 0,
                        "id": 0,
                        "name": "string",
                        "password": "string",
                        "patients": [
                            null
                        ],
                        "phoneNumber": "string",
                        "role": "PRACTITIONER",
                        "specialty": {
                            "detail": "string",
                            "id": 0,
                            "name": "string"
                        },
                        "status": 0,
                        "updatedAt": "2020-05-06T03:05:01.832Z"
                        }
                    ],
                    "status": 0,
                    "subDoctors": [
                        {
                        "age": 0,
                        "avatar": "string",
                        "createdAt": "2020-05-06T03:05:01.832Z",
                        "dateOfBirth": "string",
                        "email": "string",
                        "gender": 0,
                        "id": 0,
                        "name": "string",
                        "password": "string",
                        "phoneNumber": "string",
                        "role": "PRACTITIONER",
                        "status": 0,
                        "updatedAt": "2020-05-06T03:05:01.832Z"
                        }
                    ],
                    "updatedAt": "2020-05-06T03:05:01.832Z"
                    },
                    "replies": [
                        {
                            "content": "string",
                            "createdAt": "2020-05-06T03:05:01.832Z",
                            "id": 0,
                            "status": 0,
                            "updatedAt": "2020-05-06T03:05:01.832Z",
                            "user": {
                            "age": 0,
                            "avatar": "string",
                            "createdAt": "2020-05-06T03:05:01.832Z",
                            "dateOfBirth": "string",
                            "email": "string",
                            "gender": 0,
                            "id": 0,
                            "name": "string",
                            "password": "string",
                            "phoneNumber": "string",
                            "role": "PRACTITIONER",
                            "status": 0,
                            "updatedAt": "2020-05-06T03:05:01.832Z"
                            }
                        }
                    ],
                    "status": 0,
                    "type": 0,
                    "updatedAt": "2020-05-06T03:05:01.832Z"
                },
                "note": "string",
                "prescription": "string",
                "recordType": 0,
                "status": 0,
                "updatedAt": "2020-05-06T03:05:01.832Z"
            },
            replyText: '',
            doctorHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'EMAIL', value: 'email', align: 'start' },
                { text: 'GIỚI TÍNH', value: 'gender', align: 'start' },
                { text: 'HÀNH ĐỘNG', value: 'more', align: 'right' },
            ],
            allSpecialist: [],
            allDietitian: [],
            selectedInquiry: [],
            selectableDoctor: [],
            selectDoctorTitle: 'Chọn Bác sĩ để gán',
            selectedDoctor: [],
            editRecord: {
                obj: null,
                inquiryId: 0,
                inquiryIndex: -1,
                isMedical: null,
                dialog: false
            },
            
        }
    },
    watch: {
        patientPage(){
            this.getAllPatients(this.patientPage, this.patientPageSize)
        },
        selectedInquiry(){
            if(this.selectedInquiry.length == 0){
                this.selectableDoctor = []
                this.selectDoctorTitle = 'Chọn Bác sĩ'
                this.selectedDoctor = []
            }
            else {
                let type = this.selectedInquiry[0].type
                if(type == 0){
                    this.selectableDoctor = this.allSpecialist
                    this.selectDoctorTitle = 'Chọn Bác sĩ chuyên khoa'
                }
                else {
                    this.selectableDoctor = this.allDietitian
                    this.selectDoctorTitle = 'Chọn Bác sĩ dinh dưỡng'
                }
            }
        }
    },
    methods: {
        returnInquiryType(type){
            return (type == 0) ? 'Khám bệnh' : 'Dinh dưỡng'
        },
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
                    this.patientPages = result.data.totalPages
                    this.updatePatients(result.data.content)
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
                
            }).catch(error => {
                this.$toast.open({
                message: error,
                type: 'error',
                // all other options may go here
                })
            })
        },
        updatePatients(patArray){
            this.allPatients = patArray;
        },
        goToPatientPage(id){
            let url = `/patient/${id}`
            this.$router.push(url)
        },
        getPatientDetail(id, isDetail){
            let url = `${config.apiUrl}/patients/${id}`
            let params = {
                id: id
            }
            apiService.getApi(url, params).then(result => {
                console.log(result)
                if(result.status.toString()[0] === "2"){
                    this.processPatientDetailFromServer(result.data, isDetail)
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                this.$toast.open({
                    message: error,
                    type: 'error',
                    // all other options may go here
                })
            })
        },
        processPatientDetailFromServer(data, isDetail){
            this.patientDetail.dateOfBirth = data.dateOfBirth
            this.patientDetail.createdDate = data.createdDate
            this.patientDetail.email = data.email
            this.patientDetail.gender = this.checkGender(data.gender)
            this.patientDetail.id = data.id
            this.patientDetail.name = data.name
            this.patientDetail.phoneNumber = data.phoneNumber
            this.patientDetail.inquiries = data.inquiries
            // for(let i = 0; i < this.patientDetail.inquiries.length; i++){
            //     this.getRepliesForInquiry(i, this.patientDetail.inquiries[i].id, 1, 100)
            // }

            if(data.practitioner){
                this.patientDetail.practitioner = data.practitioner
            }
            else {
                this.patientDetail.practitioner = {
                    name: ''
                }
            }
            if(data.specialist){
                this.patientDetail.specialist = data.specialist
            }
            else {
                this.patientDetail.specialist = []
            }
            if(data.dietitian){
                this.patientDetail.dietitian = data.dietitian
            }
            else {
                this.patientDetail.dietitian = []
            }
            if(isDetail == true){
                console.log('')
            }
            else {
                this.assignToPracDialog = true
            }
            
            
        },
        getRepliesForInquiry(index, inquiryId, page, size){
            let url = `${config.apiUrl}/replies`
            let params = {
                "inquiry-id": inquiryId,
                page: page, 
                size: size
            }
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    let res = result.data.content
                    this.patientDetail.inquiries[index].replies = res
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                this.$toast.open({
                    message: error,
                    type: 'error',
                    // all other options may go here
                })
            })
        },
        getDetailInquiry(id){
            let url = `${config.apiUrl}/inquiries/${id}`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.detailInquiry = result.data
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                this.$toast.open({
    message: error,
    type: 'error',
    // all other options may go here
})
            })
        },
        assignToPrac(patientId, inquiryArr, doctorArr){
            for(let i = 0; i < doctorArr.length; i++){
                this.assignToDoctor(patientId, inquiryArr[0].id, doctorArr[i])
            }
        },
        assignToDoctor(patientId, inquiryId, doctor){
            let params = {
                "doctor-id": doctor.id,
                id: patientId,
                "inquiry-id": inquiryId
            }
            let url = `${config.apiUrl}/patients/${patientId}/doctor`
            apiService.postApiParams(url, params).then(result => {
                console.log(result)
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: `Gán quyền quản lý bệnh nhân cho bác sĩ ${doctor.name} thành công!`})
                    // this.getAllPatients(1, 10)
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                this.$toast.open({
                    message: error,
                    type: 'error',
                    // all other options may go here
                })
            })
        },
        getAllSpec(){
            let params = {
                search: 'role=1',
                page: 1,
                size: 1000,
            }
            let url = `${config.apiUrl}/doctors`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.allSpecialist = result.data.content
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                this.$toast.open({
                    message: error,
                    type: 'error',
                    // all other options may go here
                })
            })
        },
        getAllDiet(){
            let params = {
                search: 'role=2',
                page: 1,
                size: 1000,
            }
            let url = `${config.apiUrl}/doctors`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.allDietitian = result.data.content
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                this.$toast.open({
                    message: error,
                    type: 'error',
                    // all other options may go here
                })
            })
        },
        addReply(inquiryId, reply){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang thêm bình luận')
            let params = {
                "inquiry-id": inquiryId,
                reply: reply
            }
            
            let url = `${config.apiUrl}/replies`
            apiService.postApiParams(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    // let inquiryIndex = this.findObjIndexById(this.patientDetail.inquiries, inquiryId);
                    // this.patientDetail.inquiries[inquiryIndex].replies.unshift(result.data)
                    this.detailInquiry.replies.unshift(result.data)
                    this.replyText = ''
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                this.$toast.open({
                    message: error,
                    type: 'error',
                    // all other options may go here
                })
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        findObjIndexById(arr, id){
            let result = -1;
            for(let i = 0; i < arr.length; i++){
                if(arr[i].id == id){
                    result = i
                }
            }
            return result
        },
        openEditRecordDialog(inquiryId, index, isMedical){
            // if(isMedical){
            //     let inquiryIndex = this.findObjIndexById(this.detailInquiry.inquiry.medicalRecords, inquiryId);
            //     this.editRecord.obj = Object.assign({}, this.detailInquiry.inquiry.medicalRecords[inquiryIndex])
            // }
            // else {
            //     let inquiryIndex = this.findObjIndexById(this.detailInquiry.inquiry.dietRecords, inquiryId);
            //     this.editRecord.obj = Object.assign({}, this.detailInquiry.inquiry.dietRecords[inquiryIndex])
            // }
            this.editRecord.obj = (isMedical == true) ? (Object.assign({}, this.detailInquiry.inquiry.medicalRecords[index])) : (Object.assign({}, this.detailInquiry.inquiry.dietRecords[index]));
            this.editRecord.inquiryId = inquiryId
            this.editRecord.inquiryIndex = index
            this.editRecord.isMedical = isMedical
            this.editRecord.dialog = true;
        },
        //not done
        updateRecord(inquiryId, index, isMedical, diag, pres, note){
            //sending to Server...
            if(isMedical == true){
                this.detailInquiry.inquiry.medicalRecords[index].diagnose = diag
                this.detailInquiry.inquiry.medicalRecords[index].prescription = pres
                this.detailInquiry.inquiry.medicalRecords[index].note = note
            }
            else {
                this.detailInquiry.inquiry.dietRecords[index].diagnose = diag
                this.detailInquiry.inquiry.dietRecords[index].prescription = pres
                this.detailInquiry.inquiry.dietRecords[index].note = note
            }
        },
        logging(){
            console.log(this.patientDetail)
        }
    },
    created(){
        this.getAllPatients(this.patientPage, this.patientPageSize)
        this.getAllSpec()
        this.getAllDiet()
    }
}
</script>
<style scoped>

</style>