<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Chức năng dành cho Điều phối viên</h1>
            </v-col>
        </v-row>
        <v-row wrap row class="fill-height">
            <v-col cols="12" md="12" sm="12" lg="12" xl="12">
                <v-card height="100%" class="elevation-4">
                    <v-data-table :headers="inquiryHeadersMain" 
                        no-data-text="Không có yêu cầu tư vấn nào mới" loading-text="Đang lấy dữ liệu" :loading="loadingInquiries"
                        :items="inquiries" class="elevation-0" hide-default-footer>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title><h3>Các yêu cầu tư vấn mới</h3></v-toolbar-title>
                                <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                ></v-divider>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.patient="{ item }">
                            {{ item.patient.name }}
                        </template>
                        <template v-slot:item.type="{ item }">
                            {{ returnInquiryType(item.type) }}
                        </template>
                        <template v-slot:item.more="{item}">
                            <a @click.stop="openAssignToPracMainDialog(item)">Gán</a>
                        </template>
                        
                        <template v-slot:footer>
                            <br>
                            <div class="text-center">
                                <v-pagination
                                    :total-visible="7"
                                    v-model="inquiryPage"
                                    :length="inquiryPages"
                                    @input="getInquiries(inquiryPage, inquiryPageSize)"
                                ></v-pagination>
                            </div>
                            <br>
                        </template>
                    </v-data-table>
                </v-card>
                <v-dialog scrollable v-model="assignToPracDialogMain" max-width="700px" persistent>
                    <v-card>
                        <v-card-title
                            class="headline primary"
                            primary-title
                            >
                            <span style="color: white">Gán quyền quản lý bệnh nhân cho Bác sĩ đa khoa</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-data-table
                                            hide-default-footer
                                            v-model="selectedInquiryMain"
                                            :headers="inquiryHeaders"
                                            :items="selectInquiryMain"
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
                                            <template v-slot:item.patient="{ item }">
                                                {{ item.patient.name }}
                                            </template>
                                            <template v-slot:item.type="{ item }">
                                                {{ returnInquiryType(item.type) }}
                                            </template>
                                            <!-- <template v-slot:expanded-item="{ item }">
                                                <td :colspan="inquiryHeaders.length"><b>Yêu cầu tư vấn: {{ item.content }}</b> </td>
                                            </template> -->
                                        </v-data-table>
                                    </v-col>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-data-table
                                            hide-default-footer
                                            v-model="selectedDoctor"
                                            :headers="doctorHeaders"
                                            :items="allPractitioner"
                                            single-select
                                            show-select
                                            class="elevation-4"
                                            >
                                            <template v-slot:top>
                                                <v-toolbar flat>
                                                    <v-toolbar-title>Chọn Bác sĩ phụ trách</v-toolbar-title>
                                                    <v-divider
                                                        class="mx-4"
                                                        inset
                                                        vertical
                                                    ></v-divider>
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
                            <v-btn color="blue" text :disabled="selectedInquiryMain.length == 0 || selectedDoctor.length == 0" @click="assignToPrac(selectedInquiryMain[0].patient.id, selectedInquiryMain, selectedDoctor, true), assignToPracDialogMain = false">GÁN</v-btn>
                            <v-btn color="red" text @click="assignToPracDialogMain = false, selectedDoctor = [], selectedInquiryMain = [], selectInquiryMain = []">ĐÓNG</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="12" sm="12" lg="12" xl="12">
                <v-card height="100%" class="elevation-4">
                    <v-data-table v-show="showPatient" :headers="patientHeaders" 
                        no-data-text="Không có kết quả phù hợp" loading-text="Đang lấy dữ liệu" :loading="loadingPatient"
                        :items="allPatients" class="elevation-0" hide-default-footer>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title><h3>Bệnh nhân</h3></v-toolbar-title>
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
                                        text
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
                                            <!-- <v-select v-model="patientSearch.status" :items="patientStatus" label="Trạng thái"></v-select> -->
                                            <v-select clearable v-model="patientSearch.gender" :items="genderArr" label="Giới tính"></v-select>
                                            <v-text-field clearable type="number" v-model="patientSearch.age" label="Tuổi"></v-text-field>
                                            <!-- <v-text-field v-model="patientSearch.status" label="Trạng thái"></v-text-field> -->
                                            <span>
                                                <v-checkbox @change="setPatientStatusBit(0, patientStatusBitAllValue[0])" v-model="patientStatusBitAllValue[0]" label="Bệnh nhân chưa có bác sĩ quản lý"></v-checkbox>
                                                <v-checkbox @change="setPatientStatusBit(1, patientStatusBitAllValue[1])" v-model="patientStatusBitAllValue[1]" label="Bệnh nhân có bác sĩ đa khoa"></v-checkbox>
                                                <v-checkbox @change="setPatientStatusBit(2, patientStatusBitAllValue[2])" v-model="patientStatusBitAllValue[2]" label="Bệnh nhân có bác sĩ chuyên khoa"></v-checkbox>
                                                <v-checkbox @change="setPatientStatusBit(3, patientStatusBitAllValue[3])" v-model="patientStatusBitAllValue[3]" label="Bệnh nhân có bác sĩ dinh dưỡng"></v-checkbox>
                                                <!-- <v-checkbox @change="setPatientStatusBit(4, patientStatusBitAllValue[4])" v-model="patientStatusBitAllValue[4]" label="Bệnh nhân có lịch gửi chỉ số sức khỏe"></v-checkbox> -->
                                                <v-checkbox @change="setPatientStatusBit(10, patientStatusBitAllValue[10])" v-model="patientStatusBitAllValue[10]" label="Bệnh nhân hủy quyền kích hoạt"></v-checkbox>
                                                <v-checkbox @change="setPatientStatusBit(11, patientStatusBitAllValue[11])" v-model="patientStatusBitAllValue[11]" label="Tất cả bệnh nhân"></v-checkbox>
                                            </span>
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
                        <template v-slot:item.more="{item}">
                            <v-menu offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on">more_vert</v-icon>
                                </template>
                                <v-list>
                                    <v-list-item v-if="item.status != 1024" @click="getPatientDetail(item.id, true)">
                                        <v-list-item-title>Chỉnh sửa thông tin</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item v-if="item.status != 1024" @click="getPatientDetail(item.id, false)"><v-list-item-title>Gán bệnh nhân</v-list-item-title></v-list-item>
                                    <v-list-item v-if="item.status != 1024" @click="deleteUserId = item.id, deleteUserTypeIsStaff = false, deleteUserDialog = true"><v-list-item-title>Hủy kích hoạt tài khoản</v-list-item-title></v-list-item>
                                    <v-list-item v-if="item.status == 1024" @click="reactivateUser(item.id, false)"><v-list-item-title>Kích hoạt lại tài khoản</v-list-item-title></v-list-item>
                                </v-list>
                            </v-menu>
                        </template>
                        <template v-slot:item.status="{item}">
                            <span v-if="item.status != 1024">Đang hoạt động</span>
                            <span v-else style="color: red">Đã ngừng hoạt động</span>
                        </template>
                        <template v-slot:footer>
                            <br>
                            <div class="text-center">
                                <v-pagination
                                    :total-visible="7"
                                    v-model="patientPage"
                                    :length="patientPages"
                                    @input="getAllPatients(patientPage, patientPageSize, patientSearch)"
                                ></v-pagination>
                            </div>
                            <br>
                        </template>
                    </v-data-table>
                </v-card>
                <v-dialog scrollable v-model="patientDetailDialog" max-width="700px" persistent>
                    <v-card>
                        <v-card-title
                            class="headline primary"
                            primary-title
                            >
                            <span style="color: white">Thông tin chi tiết bệnh nhân</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form v-model="patientDetailValid">
                                <v-row>
                                    <v-col cols="12" sm="12" md="6">
                                        <v-text-field :rules="noEmptyRules" label="Tên" v-model="patientDetail.name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6">
                                        <v-menu
                                            ref="patientDobMenu"
                                            v-model="patientDobMenu"
                                            :close-on-content-click="false"
                                            :return-value.sync="patientDetail.dateOfBirth"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="290px"
                                            >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field readonly label="Ngày sinh" v-model="patientDetail.dateOfBirth" v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="patientDetail.dateOfBirth" @input="$refs.patientDobMenu.save(patientDetail.dateOfBirth), patientDobMenu = false" scrollable></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6">
                                        <v-select
                                            v-model="patientDetail.gender"
                                            :items="genderArr"
                                            label="Giới tính"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                        <v-text-field :rules="emailRules" label="Email" v-model="patientDetail.email"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                        <v-text-field :rules="phoneRules" label="Số điện thoại" type="number" v-model="patientDetail.phoneNumber"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6">
                                        <v-text-field label="Địa chỉ" v-model="patientDetail.address"></v-text-field>
                                    </v-col>
                                </v-row>
                                <!-- <v-row>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-data-table
                                            hide-default-footer
                                            :headers="inquiryHeaders"
                                            :items="patientDetail.inquiries"
                                            class="elevation-4"
                                            >
                                            <template v-slot:top>
                                                <v-toolbar flat>
                                                    <v-toolbar-title>Các yêu cầu tư vấn</v-toolbar-title>
                                                    <v-spacer></v-spacer>
                                                </v-toolbar>
                                            </template>
                                            <template v-slot:item.type="{ item }">
                                                {{ returnInquiryType(item.type) }}
                                            </template>
                                            <template v-slot:item.patient="{ item }">
                                                {{ item.patient.name }}
                                            </template>
                                        </v-data-table>
                                    </v-col>
                                </v-row> -->
                            </v-form>
                                
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn :disabled="!patientDetailValid" color="primary" text @click="patientDetailDialog = false, updatePatientInfo(patientDetail)">Chỉnh sửa</v-btn>
                            <v-btn color="red" text @click="patientDetailDialog = false">Đóng</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog scrollable v-model="assignToPracDialog" max-width="700px" persistent>
                    <v-card>
                        <v-card-title
                            class="headline primary"
                            primary-title
                            >
                            <span style="color: white">Gán quyền quản lý bệnh nhân cho Bác sĩ đa khoa</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-data-table
                                            hide-default-footer
                                            v-model="selectedInquiry"
                                            :headers="inquiryHeaders"
                                            :items="patientDetail.inquiries"
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
                                            <template v-slot:item.patient="{ item }">
                                                {{ item.patient.name }}
                                            </template>
                                            <template v-slot:item.type="{ item }">
                                                {{ returnInquiryType(item.type) }}
                                            </template>
                                            <!-- <template v-slot:expanded-item="{ item }">
                                                <td :colspan="inquiryHeaders.length"><b>Yêu cầu tư vấn: {{ item.content }}</b> </td>
                                            </template> -->
                                        </v-data-table>
                                    </v-col>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-data-table
                                            hide-default-footer
                                            v-model="selectedDoctor"
                                            :headers="doctorHeaders"
                                            :items="allPractitioner"
                                            single-select
                                            show-select
                                            class="elevation-4"
                                            >
                                            <template v-slot:top>
                                                <v-toolbar flat>
                                                    <v-toolbar-title>Chọn Bác sĩ đa khoa</v-toolbar-title>
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
                            <v-btn color="blue" text :disabled="selectedInquiry.length == 0 || selectedDoctor.length == 0" @click="assignToPrac(patientDetail.id, selectedInquiry, selectedDoctor, false), assignToPracDialog = false">GÁN</v-btn>
                            <v-btn color="red" text @click="assignToPracDialog = false, selectedDoctor = [], selectedInquiry = []">ĐÓNG</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                <v-dialog scrollable v-model="registerObj.dialog" max-width="700px" persistent>
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark v-on="on">Tạo tài khoản bệnh nhân</v-btn>
                    </template>
                    <v-card>
                        <v-card-title
                            class="headline primary"
                            primary-title
                            >
                            <span style="color: white">Tạo tài khoản</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form v-model="registerObj.valid">
                                <v-row wrap>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-text-field prepend-icon="people" :rules="noEmptyRules" v-model="registerObj.name" label="Tên người dùng"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-text-field prepend-icon="email" v-model="registerObj.email" :rules="emailRules" label="Email"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-text-field prepend-icon="call" v-model="registerObj.phoneNumber" :rules="phoneRules" label="Số điện thoại"></v-text-field>
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
                                                    readonly
                                                    v-model="registerObj.dateOfBirth"
                                                    label="Ngày sinh"
                                                    prepend-icon="event"
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="registerObj.dateOfBirth" no-title scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn text color="primary" @click="$refs.menu.save(registerObj.dateOfBirth)">CHỌN</v-btn>
                                            <v-btn text color="red" @click="registerObj.dateMenu = false">ĐÓNG</v-btn>
                                            
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
                                        <v-select readonly v-model="registerObj.role" :items="registerObj.roles"></v-select>
                                    </v-col>
                                </v-row>
                                <v-row >
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-text-field
                                            prepend-icon="lock"
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
                            <v-btn color="blue darken-1" :disabled="!registerObj.valid" text @click="registerObj.dialog = false, register(registerObj.name, registerObj.email, registerObj.phoneNumber, registerObj.dateOfBirth, registerObj.gender, registerObj.role, registerObj.password)">Tạo</v-btn>
                            <v-btn color="red" text @click="registerObj.dialog = false">ĐÓNG</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <!-- dialog xóa tài khoản -->
        <v-dialog
            persistent
            v-model="deleteUserDialog"
            width="400"
            >
            <v-card>
                <v-card-title
                    class="headline red"
                    primary-title
                    dark
                    >
                    <span style="color: white">Xác nhận hủy kích hoạt tài khoản</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <br>
                    Bạn có chắc chắn muốn hủy kích hoạt tài khoản này? 
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red"
                    text
                    @click="deleteUserDialog = false, deleteUser(deleteUserId, deleteUserTypeIsStaff)"
                    >
                    XÁC NHẬN
                </v-btn>
                <v-btn
                    color="primary"
                    text
                    @click="deleteUserDialog = false, deleteUserId = 0, deleteUserTypeIsStaff = null"
                    >
                    ĐÓNG
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
// const { encode } = require('url-encode-decode')
import {mapGetters} from 'vuex'
// import eventBus from '../../eventBus'
import apiService from '../../services/api.service'
import config from '../../config'
var convertNumber = require('decimal-to-binary')
export default {
    data(){
        return {
            doctorHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'EMAIL', value: 'email', align: 'start' },
                { text: 'SỐ ĐT', value: 'phoneNumber', align: 'start' },
            ],
            loadingDoctor: false,
            deleteUserDialog: false,
            deleteUserId: 0,
            deleteUserTypeIsStaff: null,
            allPatients: [],
            patientHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'TUỔI', value: 'age', align: 'start' },
                { text: 'TRẠNG THÁI', value: 'status', align: 'start' },
                { text: 'CHỌN HÀNH ĐỘNG', value: 'more', align: 'end' },
            ],
            patientPage: 1,
            patientPageSize: 10,
            patientPages: 1,
            showPatient: true,
            patientDetailDialog: false,
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
                practitioner: '',
            },
            patientDetailValid: true,
            patientDobMenu: false,
            inquiryHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN BỆNH NHÂN', value: 'patient', align: 'start' },
                { text: 'KIỂU YÊU CẦU', value: 'type', align: 'start' },
                // { text: '', value: 'data-table-expand' },
                {text: 'NỘI DUNG', value: 'content', align: 'start'}
            ],
            assignToPracDialog: false,
            patientSearch: {
                name: undefined,
                status: 1,
                gender: undefined,
                age: undefined
            },
            patientSearchMenu: false,
            patientStatus: [
                {
                    text: 'Chưa có bác sĩ quản lý',
                    value: 1
                },
                {
                    text: 'Ngừng hoạt động',
                    value: 1024
                }
            ],
            patientStatusBitAllValue: [false, false, false, false, false, false, false, false, false, false, false, false],
            
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
                    // {
                    //     text: 'Đa khoa',
                    //     value: 0
                    // },
                    // {
                    //     text: 'Chuyên khoa',
                    //     value: 1
                    // },
                    // {
                    //     text: 'Dinh dưỡng',
                    //     value: 2
                    // },
                    // {
                    //     text: 'Điều phối viên',
                    //     value: 3
                    // },
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
            ],
            allPractitioner: [],
            selectedInquiry: [],
            selectedDoctor: [],
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
                {text: 'GÁN', value: 'more', align: 'end'}
            ],
            selectInquiryMain: [],
            selectedInquiryMain: [],
            assignToPracDialogMain: false,
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
    computed: {
        ...mapGetters({
            newNotification: 'newNotification',
            handleNotificationObj: 'handleNotificationObj'
        })
    },
    watch: {
        newNotification(){
            this.handleNewNotification(this.newNotification)
        }
    },
    methods: {
        setPatientStatusBit(index, value){
            // console.log(index)
            // console.log(value)
            if(value == true){
                switch(index){
                    //new patient
                    case 0: {
                        this.patientStatusBitAllValue[1] = 0;
                        this.patientStatusBitAllValue[2] = 0;
                        this.patientStatusBitAllValue[3] = 0;
                        this.patientStatusBitAllValue[10] = 0;
                        this.patientStatusBitAllValue[11] = 0;
                        break;
                    }
                    //not new patient
                    case 1:
                    case 2:
                    case 3: {
                        this.patientStatusBitAllValue[0] = 0;
                        this.patientStatusBitAllValue[10] = 0;
                        this.patientStatusBitAllValue[11] = 0;
                        break;
                    }
                    // //schedule
                    // case 4: {
                    //     this.patientStatusBitAllValue[10] = 0;
                    //     this.patientStatusBitAllValue[11] = 0;
                    //     break;
                    // }
                    //deactivated
                    case 10: {
                        this.patientStatusBitAllValue[0] = 0;
                        this.patientStatusBitAllValue[1] = 0;
                        this.patientStatusBitAllValue[2] = 0;
                        this.patientStatusBitAllValue[3] = 0;
                        this.patientStatusBitAllValue[4] = 0;
                        this.patientStatusBitAllValue[11] = 0;
                        break;
                    }
                    //all patient
                    case 11: {
                        this.patientStatusBitAllValue[0] = 0;
                        this.patientStatusBitAllValue[1] = 0;
                        this.patientStatusBitAllValue[2] = 0;
                        this.patientStatusBitAllValue[3] = 0;
                        this.patientStatusBitAllValue[4] = 0;
                        this.patientStatusBitAllValue[10] = 0;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
            // console.log(this.returnValueFromStatusBit())
        },
        returnValueFromStatusBit(){
            if(this.patientStatusBitAllValue[11] == true){
                return -1
            }
            else if (this.patientStatusBitAllValue[10] == true){
                return 1024
            }
            else if (this.patientStatusBitAllValue[0]  == true){
                return (this.patientStatusBitAllValue[4] == true) ? 17 : 1
            }
            else {
                let bitArr = []
                for(let i = 0; i < this.patientStatusBitAllValue.length - 1 ; i++){
                    bitArr[i] = (this.patientStatusBitAllValue[i] == true) ? 1 : 0
                }
                let statusValue = bitArr.reverse().join("")
                // console.log(statusValue)
                //has been reverse
                // console.log(bitArr)
                if(bitArr[9] == 0 && (bitArr[8] == 1 || bitArr[7] == 1)){
                    return convertNumber.convertToDecimal(statusValue) + 1;
                }
                else {
                    return convertNumber.convertToDecimal(statusValue);
                }
            }
        },
        returnInquiryType(type){
            return (type == 0) ? 'Khám bệnh' : 'Dinh dưỡng'
        },
        returnGender(number){
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
        getAllPatients(page, size, searchObj){
            this.loadingPatient = true;
            this.allPatients = [];
            let params = {
                page: page,
                size: size,
            }
            searchObj.status = (this.returnValueFromStatusBit() == 0) ? 1 : this.returnValueFromStatusBit()
            let searchString = '';
            //Loop through all property of patientSearch Obj
            for (const property in searchObj) {
                if(searchObj[property] != undefined && searchObj[property] != null && searchObj[property] != ''){
                    searchString += `${property}=${searchObj[property]},`
                }
                if(searchObj[property] == 0){
                    searchString += `${property}=${searchObj[property]},`
                }
            }
            if(searchString != ''){
                params.search = searchString
            }
            let url = `${config.apiUrl}/patients`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.patientPages = result.data.totalPages
                    this.updatePatients(result.data.content)
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
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
        goToPatientPage(id){
            let url = `/patient/${id}`
            this.$router.push(url)
        },
        getPatientDetail(id, isDetail){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang lấy thông tin chi tiết bệnh nhân...')
            let url = `${config.apiUrl}/patients/${id}`
            let params = {
                id: id
            }
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.processPatientDetailFromServer(result.data, isDetail)
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        processPatientDetailFromServer(data, isDetail){
            this.patientDetail = data;
            this.patientDetail.dateOfBirth = data.dateOfBirth.split("/").reverse().join("-")
            // this.patientDetail.createdDate = data.createdDate
            // this.patientDetail.email = data.email
            // this.patientDetail.gender = data.gender
            // this.patientDetail.id = data.id
            // this.patientDetail.inquiries = data.inquiries
            // this.patientDetail.name = data.name
            // this.patientDetail.phoneNumber = data.phoneNumber
            // this.patientDetail.address = data.address
            if(isDetail == true){
                this.patientDetailDialog = true
            }
            else {
                this.assignToPracDialog = true
            }
        },
        assignToPrac(patientId, inquiry, doctor, fromMainTable){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang gán bệnh nhân cho bác sĩ...')
            let url = `${config.apiUrl}/patients/${patientId}/doctor`
            let body = {
                "doctor_id": doctor[0].id,
                "inquiry_id": inquiry[0].id
            }
            // console.log(url)
            // console.log(body)
            // console.log(fromMainTable)
            apiService.postApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Gán quyền quản lý bệnh nhân thành công',
                        type: 'success',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Gán quyền quản lý bệnh nhân thành công!'})
                    if(fromMainTable){
                        this.selectedDoctor = []
                        this.selectedInquiryMain = []
                        this.selectInquiryMain = []
                        
                    }
                    else {
                        this.selectedDoctor = []
                        this.selectedInquiry = []
                        
                        
                    }
                    this.inquiryPage = 1;
                    this.getInquiries(this.inquiryPage, this.inquiryPageSize)
                    this.patientPage = 1;
                    this.patientSearch = {
                        name: undefined,
                        status: 1,
                        gender: undefined,
                        age: undefined
                    }
                    this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        register(name, email, phone, dob, gender, role, password){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang Tạo tài khoản mới...')
            let body = {
                name: name,
                email: email,
                phone: phone,
                dob: dob.split("-").reverse().join("/"),
                gender: parseInt(gender, 10),
                role: role,
                password: password
            }
            let url = `${config.apiUrl}/auth/sign_up`
            apiService.postApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Tạo tài khoản thành công',
                        type: 'success',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Tạo tài khoản thành công'})
                    this.patientPage = 1;
                    this.patientSearch = {
                        name: undefined,
                        status: 1,
                        gender: undefined,
                        age: undefined
                    }
                    this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        deleteUser(id, isStaff){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang hủy kích hoạt tài khoản này...')
            let url = `${config.apiUrl}/user`
            let body = {
                id: id
            }
            apiService.deleteApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Hủy kích hoạt tài khoản thành công',
                        type: 'success',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Xóa tài khoản thành công'})
                    if(isStaff){
                        this.doctorPage = 1;
                        this.getAllDoctor(this.doctorPage, this.doctorPageSize, this.doctorSearch)
                    }
                    else {
                        this.patientPage = 1;
                        this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
                    }
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
                
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
                this.deleteUserId = 0;
                this.deleteUserTypeIsStaff = null;
            })
        },
        reactivateUser(id, isStaff){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang tái kích hoạt tài khoản này...')
            let url = `${config.apiUrl}/user`
            let body = {
                id: id
            }
            apiService.postApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Tái kích hoạt tài khoản thành công',
                        type: 'success',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Tái kích hoạt tài khoản thành công'})
                    if(isStaff){
                        this.doctorPage = 1;
                        this.getAllDoctor(this.doctorPage, this.doctorPageSize, this.doctorSearch)
                    }
                    else {
                        this.patientPage = 1;
                        this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
                    }
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
                
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        getAllPractitioner(){
            let params = {
                page: 1,
                size: 1000,
                search: 'role=0,status=1'
            }
            let url = `${config.apiUrl}/doctors`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.allPractitioner = result.data.content
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            })
        },
        getInquiries(page, size){
            this.inquiries = [];
            this.loadingInquiries = true;
            let url = `${config.apiUrl}/inquiries`
            let params = {
                page: page,
                size: size
            }
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.inquiries = result.data.content
                    this.inquiryPages = result.data.totalPages
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.loadingInquiries = false;
            })
        },
        openAssignToPracMainDialog(item){
            this.selectInquiryMain.push(item)
            this.selectedInquiryMain.push(item)
            this.assignToPracDialogMain = true
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
        handleNewNotification(e){
            let url = `${config.apiUrl}/notifications/${e.notificationId}`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    let type = result.data.type
                    //patient send new inquiry, prac remove patient, prac accept assign, prac reject assign, 
                    if(type == 0 || type == 6 || type == 4 || type == 5){
                        this.patientPage = 1;
                        this.patientSearch = {
                            name: undefined,
                            status: 1,
                            gender: undefined,
                            age: undefined
                        }
                        this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
                        this.inquiryPage = 1;
                        this.getInquiries(this.inquiryPage, this.inquiryPageSize)
                    }
                }
            }).catch(error => {
                console.log(error)
            })
        },
        updateDoctorInfo(detailObj){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang cập nhật thông tin...')
            let url = `${config.apiUrl}/user/${detailObj.id}`
            let body = {
                "description": detailObj.description,
                "dob": detailObj.dateOfBirth.split("-").reverse().join("/"),
                "email": detailObj.email,
                "gender": detailObj.gender,
                "name": detailObj.name,
                "phone": detailObj.phoneNumber
            }
            apiService.putApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Cập nhật thành công!',
                        type: 'error',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Cập nhật thành công!'})
                    this.doctorPage = 1;
                    this.getAllDoctor(this.doctorPage, this.doctorPageSize, this.doctorSearch)
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        updatePatientInfo(detailObj){
            // console.log(detailObj)
            this.$store.dispatch('turnOnLoadingDialog', 'Đang cập nhật thông tin...')
            let url = `${config.apiUrl}/user/${detailObj.id}`
            let body = {
                "address": detailObj.address,
                "dob": detailObj.dateOfBirth.split("-").reverse().join("/"),
                "email": detailObj.email,
                "gender": detailObj.gender,
                "name": detailObj.name,
                "phone": detailObj.phoneNumber
            }
            apiService.putApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Cập nhật thành công!',
                        type: 'success',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Cập nhật thành công!'})
                    this.patientPage = 1;
                    this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        checkComeFromNotiPage(){
            let typeNoti = this.handleNotificationObj.typeNoti
            let payloadId = this.handleNotificationObj.payloadId
            // console.log(payloadId)
            if(typeNoti != -1){
                switch(typeNoti){
                    case 0: {
                        break;
                    }
                    case 4: {
                        break;
                    }
                    case 5: {
                        break;
                    }
                    case 6: {
                        this.getPatientDetail(payloadId, false)
                        break
                    }
                    default: {
                        break;
                    }
                }
                this.$store.dispatch('resetHandleNotification')
            }
        }
    },
    created(){
        // eventBus.$on('newNotification', this.handleNewNotification);
        // alert(convertNumber.convertToBinary(8))
        // alert(convertNumber.convertToDecimal(10000))
        this.checkComeFromNotiPage()
        this.registerObj.dateOfBirth = new Date().toISOString().substr(0, 10)
        
        this.getInquiries(this.inquiryPage, this.inquiryPageSize)
        this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
        
        this.getAllPractitioner()
    },
    destroyed(){
        // eventBus.$off('newNotification', this.handleNewNotification);
    }
}
</script>
<style scoped>

</style>