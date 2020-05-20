<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Chức năng dành cho Bác sĩ Chuyên khoa/Dinh dưỡng</h1>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col cols="12" sm="12" md="12" lg="6" xl="6">
                <v-card class="elevation-4" height="100%">
                    <v-data-table class="elevation-1" no-data-text="Không có yêu cầu tư vấn nào" loading-text="Đang lấy dữ liệu" :loading="loadingInquiries" :headers="inquiryHeadersMain" :items="inquiries" hide-default-footer>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title><h3>Danh sách yêu cầu tư vấn</h3></v-toolbar-title>
                                <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                ></v-divider>
                                <v-spacer></v-spacer>
                                <v-select :items="inquiryAssignValue" v-model="inquiryAssign" @input="inquiryPage = 1, getInquiries(inquiryPage, inquiryPageSize, inquiryAssign)"></v-select>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.patient="{ item }">
                            {{ item.patient.name }}
                        </template>
                        <template v-slot:item.type="{ item }">
                            {{ returnInquiryType(item.type) }}
                        </template>
                        <template v-slot:item.more="{item}">
                            <a @click.stop="getPatientDetail(item.patient.id), getDetailInquiry(item.id)">Xem</a>
                        </template>
                    </v-data-table>
                    <br>
                    <div class="text-center">
                        <v-pagination
                            v-model="inquiryPage"
                            :length="inquiryPages"
                            @input="getInquiries(inquiryPage, inquiryPageSize, inquiryAssign)"
                        ></v-pagination>
                    </div>
                    <br>
                </v-card>
            </v-col>
            <v-col cols="12" md="12" sm="12" lg="6" xl="6">
                <v-card class="elevation-4" height="100%">
                    <v-data-table class="elevation-1" no-data-text="Không có kết quả phù hợp" loading-text="Đang lấy dữ liệu" :loading="loadingPatient" v-show="showPatient" :headers="patientHeaders" :items="allPatients" hide-default-footer>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title><h3>Danh sách bệnh nhân quản lý</h3></v-toolbar-title>
                                <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                ></v-divider>
                                <v-spacer></v-spacer>
                                <v-menu
                                    v-model="patientSearchMenu"
                                    :close-on-content-click="false"
                                    :nudge-width="200"
                                    offset-x
                                    >
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                        color="primary"
                                        dark
                                        v-on="on"
                                        >
                                        <v-icon>search</v-icon>
                                        Tìm kiếm
                                        </v-btn>
                                    </template>

                                    <v-card>
                                        <v-card-title>
                                            <h4>Tìm kiếm bệnh nhân</h4>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-text-field clearable v-model="patientSearch.name" label="Tên"></v-text-field>
                                            <v-select clearable v-model="patientSearch.gender" :items="genderArr" label="Giới tính"></v-select>
                                            <v-text-field clearable type="number" v-model="patientSearch.age" label="Tuổi"></v-text-field> 
                                            
                                            <!-- <v-checkbox :label="patientAllStatus[0].text" v-model="patientAllStatus[0].value"></v-checkbox>
                                            <v-checkbox :label="patientAllStatus[1].text" v-model="patientAllStatus[1].value"></v-checkbox>
                                            <v-checkbox :label="patientAllStatus[2].text" v-model="patientAllStatus[2].value"></v-checkbox>
                                            <v-checkbox :label="patientAllStatus[3].text" v-model="patientAllStatus[3].value"></v-checkbox> -->
                                            <!-- <v-select v-model="patientSearch.status" :items="patientStatus" label="Trạng thái"></v-select> -->
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" text @click="patientSearchMenu = false, patientPage = 1, getAllPatients(patientPage, patientPageSize, patientSearch)">Tìm kiếm</v-btn>
                                            <v-btn text color="red" @click="patientSearchMenu = false">Đóng</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-menu>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.name="{item}">
                            <a @click="getPatientDetail(item.id)">{{item.name}}</a>
                        </template>
                        <template v-slot:item.more="{item}">
                            <v-menu offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on">more_vert</v-icon>
                                </template>
                                <v-list>
                                    <v-list-item @click="getPatientDetail(item.id)">
                                        <v-list-item-title>Xem chi tiết</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="removePatientObj.id = item.id, removePatientObj.dialog = true"><v-list-item-title>Xóa bệnh nhân khỏi quyền quản lý</v-list-item-title></v-list-item>
                                </v-list>
                            </v-menu>
                        </template>
                    </v-data-table>
                    <br>
                    <div class="text-center">
                        <v-pagination
                            v-model="patientPage"
                            :length="patientPages"
                            @input="getAllPatients(patientPage, patientPageSize, patientSearch)"
                        ></v-pagination>
                    </div>
                    <br>
                </v-card>
            </v-col>
            <v-dialog
                persistent
                v-model="removePatientObj.dialog"
                width="400"
                >
                <v-card>
                    <v-card-title
                        class="headline red"
                        primary-title
                        dark
                        >
                        <span style="color: white">Xác nhận xóa</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <br>
                        Bạn có chắc chắn muốn xóa bệnh nhân này khỏi quyền quản lý của mình?
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="red"
                        text
                        @click="removePatientObj.dialog = false, removePatient(removePatientObj.id)"
                        >
                        XÓA
                    </v-btn>
                    <v-btn
                        color="primary"
                        text
                        @click="removePatientObj.dialog = false, removePatientObj.id = 0"
                        >
                        ĐÓNG
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
        <v-row wrap row class="fill-height">
            <v-col cols="12" md="12" sm="12" lg="4" xl="4">
                <v-card class="elevation-4" height="100%">
                    <v-card-title>
                        <h3>Thông tin chi tiết bệnh nhân</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field readonly label="ID" v-model="patientDetail.id"></v-text-field>
                                    <v-text-field readonly label="Tên" v-model="patientDetail.name"></v-text-field>
                                    <v-text-field readonly label="Ngày sinh" v-model="patientDetail.dateOfBirth"></v-text-field>
                                    <v-text-field readonly label="Giới tính" v-model="patientDetail.gender"></v-text-field>
                                    <v-text-field readonly label="Email" v-model="patientDetail.email"></v-text-field>
                                    <v-text-field readonly label="Số điện thoại" v-model="patientDetail.phoneNumber"></v-text-field>
                                    <h3>Bác sĩ đa khoa phụ trách: {{patientDetail.practitioner.name}}</h3>
                                </v-col>
                                <v-col cols="12">
                                    <h3>Bác sĩ chuyên khoa phụ trách:</h3>
                                    <h3 :key="doctor.id" v-for="doctor in patientDetail.specialists"> - {{doctor.name}}</h3>
                                </v-col>
                                <v-col cols="12">
                                    <h3>Bác sĩ dinh dưỡng phụ trách:</h3>
                                    <h3 :key="doctor.id" v-for="doctor in patientDetail.dietitians"> - {{doctor.name}}</h3>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-data-table show-expand hide-default-footer class="elevation-4" :items="patientDetail.inquiries" :headers="inquiryHeaders">
                                        <template v-slot:top>
                                            <v-toolbar flat>
                                                <v-toolbar-title><h3>Danh sách yêu cầu tư vấn</h3></v-toolbar-title>
                                                <v-divider
                                                    class="mx-4"
                                                    inset
                                                    vertical
                                                ></v-divider>
                                            </v-toolbar>
                                        </template>
                                        <template v-slot:item.patient="{ item }">
                                            {{item.patient.name}}
                                        </template>
                                        <template v-slot:item.type="{ item }">
                                            {{ returnInquiryType(item.type) }}
                                        </template>
                                        <template v-slot:expanded-item="{ item }">
                                            <td :colspan="inquiryHeaders.length">
                                                <br>
                                                <h4>Nội dung yêu cầu tư vấn: {{ item.content }}</h4>
                                                <br>
                                                <a @click.stop="getDetailInquiry(item.id)">Xem chi tiết >></a>
                                                <br>
                                            </td>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="12" sm="12" lg="8" xl="8">
                <v-card class="elevation-4" height="100%">
                    <v-card-title><h3>Chi tiết yêu cầu tư vấn</h3></v-card-title>
                    <v-card-text v-if="detailInquiry != null">
                        <v-row>
                            <v-col cols="12">
                                <h3>Nội dung: {{detailInquiry.content}}</h3>
                                <h3>Kiểu yêu cầu: {{returnInquiryType(detailInquiry.type)}}</h3>
                                <h3 v-if="detailInquiry.type == 0">Thời gian làm xét nghiệm: {{detailInquiry.date}}</h3>
                                <h3 v-if="detailInquiry.type == 1">Thời gian ăn: {{detailInquiry.date}}</h3>
                                <h3>Ảnh: </h3>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col v-for="(record, index) in detailInquiry.medicalRecords" :key="record.id" cols="12">
                                <v-card class="elevation-4">
                                    <v-card-title>Trả lời yêu cầu tư vấn</v-card-title>
                                    <v-card-text>
                                        Bác sĩ: {{record.specialist.name}}
                                        <br>
                                        Chức vụ: {{record.specialist.role}}
                                        <br>
                                        <!-- Chuyên môn: {{record.specialist.specialty.name}}
                                        <br> -->
                                        Chẩn đoán: {{record.diagnose}}
                                        <br>
                                        Kê đơn thuốc: {{record.prescription}}
                                        <br>
                                        Ghi chú: {{record.note}}
                                        <br>
                                    </v-card-text>
                                    <v-card-actions v-if="record.specialist && record.specialist.id == $store.state.user.id">
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" rounded @click="openEditRecordDialog(record.id, index, true)">Chỉnh sửa tư vấn</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                            <v-col v-for="(record, index) in detailInquiry.dietRecords" :key="record.id" cols="12">
                                <v-card class="elevation-4">
                                    <v-card-title>Trả lời yêu cầu tư vấn</v-card-title>
                                    <v-card-text>
                                        Bác sĩ: {{record.dietitian.name}}
                                        <br>
                                        Chức vụ: {{record.dietitian.role}}
                                        <br>
                                        <!-- Chuyên môn: {{record.dietitian.specialty.name}}
                                        <br> -->
                                        Kê đơn thuốc: {{record.prescription}}
                                        <br>
                                        Ghi chú: {{record.note}}
                                        <br>
                                    </v-card-text>
                                    <v-card-actions v-if="record.dietitian && record.dietitian.id == $store.state.user.id">
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" rounded @click="openEditRecordDialog(record.id, index, false)">Chỉnh sửa tư vấn</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                        <br>
                        <v-btn @click="openNewRecordDialog(detailInquiry.id, detailInquiry.type)" rounded color="primary">Thêm câu trả lời tư vấn mới</v-btn>
                        <br>
                        <br>
                        <v-card class="elevation-4">
                            <v-card-title>
                                Bình luận
                            </v-card-title>
                            <v-card-text>
                                <div :key="reply.id" v-for="reply in detailInquiry.replies" style="margin: 10px; padding: 10px; border: 1px solid grey; border-radius: 10px;">
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
                                            <v-btn :disabled="replyText == ''" color="primary" @click="addReply(detailInquiry.id, replyText)" >Bình luận</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                <br>
                            </v-card-actions>
                        </v-card>
                    </v-card-text>
                    <!-- add record dialog -->
                    <v-dialog max-width="700px" v-model="newRecord.dialog" persistent>
                        <v-card class="elevation-4">
                            <v-card-title
                                class="headline primary"
                                primary-title
                                >
                                Tạo tư vấn mới
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row v-if="newRecord.isMedical == true">
                                        <v-col cols="12">
                                            <v-textarea rows="2" v-model="newRecord.obj.diagnose" label="Chẩn đoán"></v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-textarea rows="2" v-model="newRecord.obj.prescription" label="Đơn thuốc"></v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-textarea rows="2" v-model="newRecord.obj.note" label="Ghi chú"></v-textarea>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue" v-if="newRecord.isMedical == true" :disabled="newRecord.obj.diagnose == '' || newRecord.obj.prescription == ''|| newRecord.obj.note ==''" text @click=" newRecord.dialog = false, addNewRecord(newRecord.inquiryId, newRecord.isMedical, newRecord.obj.prescription, newRecord.obj.note, newRecord.obj.diagnose)">Tạo mới</v-btn>
                                <v-btn color="blue" v-if="newRecord.isMedical == false" :disabled="newRecord.obj.prescription == ''|| newRecord.obj.note ==''" text @click="newRecord.dialog = false, addNewRecord(newRecord.inquiryId, newRecord.isMedical, newRecord.obj.prescription, newRecord.obj.note)">Tạo mới</v-btn>
                                <v-btn color="red" text @click="newRecord.dialog = false">Đóng</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!-- edit record dialog -->
                    <v-dialog max-width="700px" v-model="editRecord.dialog" persistent>
                        <v-card class="elevation-4" v-if="editRecord.obj != null">
                            <v-card-title
                                class="headline primary"
                                primary-title
                                >
                                Chỉnh sửa tư vấn 
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row v-if="editRecord.isMedical == true">
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
                                <v-btn color="blue" v-if="editRecord.isMedical == true" :disabled="editRecord.obj.diagnose == '' || editRecord.obj.prescription == ''|| editRecord.obj.note ==''" text @click="updateRecord(editRecord.recordId, editRecord.recordIndex, editRecord.isMedical, editRecord.obj.prescription, editRecord.obj.note, editRecord.obj.diagnose), editRecord.dialog = false, editRecord.obj = null">Chỉnh sửa</v-btn>
                                <v-btn color="blue" v-if="editRecord.isMedical == false" :disabled="editRecord.obj.prescription == ''|| editRecord.obj.note ==''" text @click="updateRecord(editRecord.recordId, editRecord.recordIndex, editRecord.isMedical, editRecord.obj.prescription, editRecord.obj.note), editRecord.dialog = false, editRecord.obj = null">Chỉnh sửa</v-btn>
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
            allPatients: [],
            patientHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'TUỔI', value: 'age', align: 'start' },
                { text: 'HÀNH ĐỘNG', value: 'more', align: 'end' },
            ],
            patientPage: 1,
            patientPageSize: 10,
            patientPages: 0,
            showPatient: true,
            loadingPatient: false,
            patientDetail: {
                dateOfBirth: '',
                createdDate: '',
                email: '',
                gender: '',
                id: '',
                inquiries: [],
                name: '',
                phoneNumber: '',
                practitioner: {},
                specialists: [],
                dietitians: [],
            },
            inquiryHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN BỆNH NHÂN', value: 'patient', align: 'start' },
                { text: 'KIỂU YÊU CẦU', value: 'type', align: 'start' },
                { text: '', value: 'data-table-expand' },
            ],
            patientSearch: {
                name: undefined,
                status: 0,
                gender: undefined,
                age: undefined,
            },
            patientSearchMenu: false,
            //Array of all status can be chosen
            patientAllStatus: [
                {
                    key: 2,
                    text: 'Đã được gán cho Bác sĩ đa khoa',
                    value: false
                },
                {
                    key: 4,
                    text: 'Đã được gán cho Bác sĩ chuyên khoa',
                    value: false
                },
                {
                    key: 8,
                    text: 'Đã được gán cho Bác sĩ dinh dưỡng',
                    value: false
                },
                {
                    key: 16,
                    text: 'Đã được đặt lịch gửi chỉ số sức khỏe',
                    value: false
                },
            ],
            //Array of chosen status
            // patientChosenStatusArr: [],
            detailInquiry: null,
            replyText: '',
            doctorHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'EMAIL', value: 'email', align: 'start' },
                { text: 'GIỚI TÍNH', value: 'gender', align: 'start' },
                { text: 'HÀNH ĐỘNG', value: 'more', align: 'right' },
            ],
            editRecord: {
                obj: null,
                recordId: 0,
                recordIndex: -1,
                isMedical: null,
                dialog: false,
            },
            newRecord: {
                obj: {
                    diagnose: '',
                    note: '',
                    prescription: ''
                },
                inquiryId: 0,
                isMedical: null,
                dialog: false,
            },
            genderArr: [
                {
                    text: 'Nam',
                    value: 0
                },
                {
                    text: 'Nữ',
                    value: 1
                },
                {
                    text: 'Khác',
                    value: 2
                },
            ],
            removePatientObj: {
                dialog: false,
                id: 0
            },
            inquiries: [],
            loadingInquiries: false,
            inquiryPage: 1,
            inquiryPageSize: 10,
            inquiryPages: 0,
            inquiryHeadersMain: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN BỆNH NHÂN', value: 'patient', align: 'start' },
                { text: 'KIỂU YÊU CẦU', value: 'type', align: 'start' },
                // { text: '', value: 'data-table-expand' },
                {text: 'NỘI DUNG', value: 'content', align: 'start'},
                {text: 'HÀNH ĐỘNG', value: 'more', align: 'end'}
            ],
            inquiryAssignValue: [
                {
                    text: 'Tất cả các yêu cầu',
                    value: true
                },
                {
                    text: 'Yêu cầu chưa được gán cho bác sĩ cấp dưới',
                    value: false
                },
            ],
            inquiryAssign: true,

        }
    },
    watch: {
    },
    methods: {
        clearSpecAndDietCheck(){
            if(this.patientAllStatus[0].value == true){
                this.patientAllStatus[1].value = false;
                this.patientAllStatus[2].value = false;
                return;
            }
            else {
                return;
            }
        },
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
        getAllPatients(page, size, searchObj){
            this.loadingPatient = true;
            this.allPatients = [];
            let params = {
                page: page,
                size: size,
            }
            let searchString = '';
            //Loop through all property of patientSearch Obj
            for (const property in searchObj) {
                if(searchObj[property] != undefined && searchObj[property] != null && searchObj[property] != ''){
                    searchString += `${property}=${searchObj[property]},`
                }
            }
            // console.log(this.patientAllStatus)
            // let status = 0;
            // if(this.patientAllStatus[0].value == true){
            //     status = 2 + ((this.patientAllStatus[3].value == true) ? 16 : 0);
            // }
            // else {
            //     for(let i = 1; i < this.patientAllStatus.length; i++){
            //         if(this.patientAllStatus[i].value == true){
            //             status += this.patientAllStatus[i].key
            //         }
            //     }
            //     if(status != 0){
            //         status += 2;
            //     }
            // }
            // console.log(status)
            let status = 0;
            for(let i = 0; i < this.patientAllStatus.length; i++){
                if(this.patientAllStatus[i].value == true){
                    status += this.patientAllStatus[i].key
                }
            }
            if(status != 0){
                searchString += `status=${status},`
            }
            // console.log(searchString)
            params.search = searchString
            let url = `${config.apiUrl}/patients`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.patientPages = result.data.totalPages
                    this.updatePatients(result.data.content)
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
                
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.loadingPatient = false;
            })
        },
        updatePatients(patArray){
            this.allPatients = patArray;
        },
        getPatientDetail(id){
            this.detailInquiry = null;
            this.$store.dispatch('turnOnLoadingDialog', 'Đang lấy thông tin chi tiết bệnh nhân...')
            let url = `${config.apiUrl}/patients/${id}`
            let params = {
                id: id
            }
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.processPatientDetailFromServer(result.data)
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
                // this.$toast.open({
                //     message: error,
                //     type: 'error',
                //     // all other options may go here
                // })
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        processPatientDetailFromServer(data){
            this.patientDetail.dateOfBirth = data.dateOfBirth
            this.patientDetail.createdDate = data.createdDate
            this.patientDetail.email = data.email
            this.patientDetail.gender = this.checkGender(data.gender)
            this.patientDetail.id = data.id
            this.patientDetail.name = data.name
            this.patientDetail.phoneNumber = data.phoneNumber
            this.patientDetail.inquiries = data.inquiries
            if(data.practitioner){
                this.patientDetail.practitioner = data.practitioner
            }
            else {
                this.patientDetail.practitioner = {
                    name: ''
                }
            }
            if(data.specialists){
                this.patientDetail.specialists = data.specialists
            }
            else {
                this.patientDetail.specialists = []
            }
            if(data.dietitians){
                this.patientDetail.dietitians = data.dietitians
            }
            else {
                this.patientDetail.dietitians = []
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
            this.detailInquiry = null;
            this.$store.dispatch('turnOnLoadingDialog', 'Đang lấy thông tin chi tiết yêu cầu tư vấn...')
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
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        addReply(inquiryId, reply){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang thêm bình luận...')
            let body = {
                "inquiry_id": inquiryId,
                reply: reply
            }
            
            let url = `${config.apiUrl}/replies`
            apiService.postApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.detailInquiry.replies.unshift(result.data)
                    this.replyText = ''
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
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
        openEditRecordDialog(recordId, index, isMedical){
            this.editRecord.obj = (isMedical == true) ? (Object.assign({}, this.detailInquiry.medicalRecords[index])) : (Object.assign({}, this.detailInquiry.dietRecords[index]));
            this.editRecord.recordId = recordId
            this.editRecord.recordIndex = index
            this.editRecord.isMedical = isMedical
            this.editRecord.dialog = true;
        },
        updateRecord(recordId, index, isMedical, pres, note, diag){
            let url = `${config.apiUrl}/records`
            let body = {
                id: recordId,
                prescription: pres,
                note: note
            }
            if(diag){
                body.diagnose = diag;
            }
            this.$store.dispatch('turnOnLoadingDialog', 'Đang chỉnh sửa trả lời tư vấn...')
            apiService.putApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Chỉnh sửa tư vấn thành công'})
                    if(isMedical == true){
                        this.detailInquiry.medicalRecords[index].diagnose = diag
                        this.detailInquiry.medicalRecords[index].prescription = pres
                        this.detailInquiry.medicalRecords[index].note = note
                    }
                    else {
                        this.detailInquiry.dietRecords[index].prescription = pres
                        this.detailInquiry.dietRecords[index].note = note
                    }
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        openNewRecordDialog(inquiryId, inquiryType){
            this.newRecord.inquiryId = inquiryId
            this.newRecord.isMedical = (inquiryType == 0) ? true : false;
            this.newRecord.dialog = true;
        },
        addNewRecord(inquiryId, isMedical, pres, note, diag){
            let url = `${config.apiUrl}/records`
            let body = {
                inquiry_id: inquiryId,
                prescription: pres,
                note: note
            }
            if(diag){
                body.diagnose = diag;
            }
            this.$store.dispatch('turnOnLoadingDialog', 'Đang tạo câu trả lời tư vấn...')
            apiService.postApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Tạo câu trả lời tư vấn thành công'})
                    if(isMedical == true){
                        this.detailInquiry.medicalRecords.push(result.data)
                    }
                    else {
                        this.detailInquiry.dietRecords.push(result.data)
                    }
                    this.newRecord = {
                        obj: {
                            diagnose: '',
                            note: '',
                            prescription: ''
                        },
                        inquiryId: 0,
                        inquiryIndex: -1,
                        isMedical: null,
                        dialog: false,
                    }
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        
        removePatient(id){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang xóa khỏi quyền quản lý...')
            let url = `${config.apiUrl}/patients/${id}/doctor`
            apiService.deleteApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Xóa khỏi quyền quản lý thành công'})
                    this.patientPage = 1;
                    this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
                    this.inquiryPage = 1;
                    this.getInquiries(this.inquiryPage, this.inquiryPageSize, this.inquiryAssign)
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        getInquiries(page, size, assigned){
            this.detailInquiry = null;
            this.inquiries = [];
            this.loadingInquiries = true;
            let url = `${config.apiUrl}/inquiries`
            let params = {
                page: page,
                size: size
            }
            if(assigned){
                params.assigned = assigned
            }
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.inquiries = result.data.content
                    this.inquiryPages = result.data.totalPages
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.loadingInquiries = false;
            })
        },
        logging(){
            console.log(this.patientDetail)
        }
    },
    created(){
        this.getInquiries(this.inquiryPage, this.inquiryPageSize, this.inquiryAssign)
        this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
    }
}
</script>
<style scoped>

</style>