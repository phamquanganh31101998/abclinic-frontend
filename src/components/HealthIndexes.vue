<template>
    <v-row>
        <v-col cols="12" sm="12" md="12" lg="6" xl="6">
            <v-card class="elevation-4" height="100%">
                <v-data-table class="elevation-0" :headers="healthIndexesSchedules.headers" :items="healthIndexesSchedules.data" hide-default-footer no-data-text="Hiện tại chưa có lịch gửi nào" loading-text="Đang lấy dữ liệu..." :loading="healthIndexesSchedules.loading">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title><h3>Lịch gửi thông số sức khỏe</h3></v-toolbar-title>
                            <v-divider
                                class="mx-4"
                                inset
                                vertical
                            ></v-divider>
                            <!-- dialog tạo lịch -->
                            <v-dialog v-model="newScheduleDialog" persistent max-width="700px">
                                <v-card>
                                    <v-card-title
                                        class="headline primary"
                                        primary-title
                                        >
                                        <span style="color: white">Tạo lịch gửi thông số sức khỏe</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                                    <h3>Thời gian nhắc nhở</h3>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="4" lg="4" xl="4">
                                                    <v-menu
                                                        ref="startDateMenu"
                                                        v-model="newSchedule.startDateMenu"
                                                        :close-on-content-click="false"
                                                        :return-value.sync="newSchedule.startDateMenu"
                                                        transition="scale-transition"
                                                        offset-y
                                                        min-width="290px"
                                                        >
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field
                                                                v-model="newSchedule.startDate"
                                                                label="Ngày bắt đầu"
                                                                readonly
                                                                prepend-icon="event"
                                                                v-on="on"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker v-model="newSchedule.startDate" @input="newSchedule.startDateMenu = false" scrollable></v-date-picker>
                                                    </v-menu>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="4" lg="4" xl="4">
                                                    <v-menu
                                                        ref="startTimeMenu"
                                                        v-model="newSchedule.startTimeMenu"
                                                        :close-on-content-click="false"
                                                        :return-value.sync="newSchedule.startTimeMenu"
                                                        transition="scale-transition"
                                                        offset-y
                                                        min-width="290px"
                                                        >
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field
                                                                v-model="newSchedule.startTime"
                                                                label="Giờ bắt đầu"
                                                                readonly
                                                                prepend-icon="event"
                                                                v-on="on"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-time-picker v-model="newSchedule.startTime" scrollable @click:minute="newSchedule.startTimeMenu = false"></v-time-picker>
                                                    </v-menu>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="12" md="4" lg="4" xl="4">
                                                    <h3>Chu kỳ nhắc nhở</h3>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="2" lg="2" xl="2">
                                                    <v-text-field v-model="newSchedule.month" label="Tháng" type="number"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="2" lg="2" xl="2">
                                                    <v-text-field v-model="newSchedule.week" label="Tuần" type="number"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="2" lg="2" xl="2">
                                                    <v-text-field v-model="newSchedule.day" label="Ngày" type="number"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="2" lg="2" xl="2">
                                                    <v-text-field v-model="newSchedule.hour" label="Giờ" type="number"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="12" md="3" lg="3" xl="3">
                                                    <h3>Mô tả lịch gửi</h3>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="9" lg="9" xl="9">
                                                    <v-text-field v-model="newSchedule.description"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                                    <v-data-table 
                                                        class="elevation-4" 
                                                        :headers="healthIndexesHeaders" 
                                                        :items="healthIndexes" 
                                                        show-select
                                                        single-select
                                                        v-model="newSchedule.indexObj"
                                                        hide-default-footer 
                                                        no-data-text="Hiện tại chưa có chuyên môn nào" 
                                                        loading-text="Đang lấy dữ liệu..." 
                                                        :loading="loadingHealthIndexes"
                                                        show-expand
                                                        single-expand
                                                        >
                                                        <template v-slot:top>
                                                            <v-toolbar flat>
                                                                <v-toolbar-title><h3>Chọn mẫu thông số sức khỏe</h3></v-toolbar-title>
                                                                <v-divider
                                                                    class="mx-4"
                                                                    inset
                                                                    vertical
                                                                ></v-divider>
                                                            </v-toolbar>
                                                        </template>
                                                        <template v-slot:expanded-item="{ item }">
                                                            <td :colspan="healthIndexesHeaders.length">
                                                                <br>
                                                                <h4>Danh sách các chỉ số cần gửi</h4>
                                                                <div v-for="(field) in item.fields" :key="field.id" style="padding-left: 20px;">
                                                                    - {{field.name}} 
                                                                </div>
                                                                <br>
                                                            </td>
                                                        </template>
                                                    </v-data-table>
                                                    <br>
                                                    <div class="text-center">
                                                        <v-pagination
                                                            :total-visible="7"
                                                            v-model="healthIndexesPage"
                                                            :length="healthIndexesPages"
                                                            @input="newSchedule.indexObj = [], getHealthIndexes(healthIndexesPage, healthIndexesPageSize)"
                                                        ></v-pagination>
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text :disabled="(!checkTimeScheduleAvailable) || (newSchedule.indexObj.length == 0)" @click="createSchedule(newSchedule)">TẠO</v-btn>
                                        <v-btn color="red" text @click="closeNewScheduleDialog()">ĐÓNG</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-spacer></v-spacer>
                            <v-menu
                                v-model="healthIndexesSchedules.searchMenu"
                                :close-on-content-click="false"
                                :nudge-width="200"
                                offset-x
                                >
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                    color="primary"
                                    dark
                                    text
                                    v-on="on"
                                    >
                                    <v-icon>search</v-icon>
                                    Tìm kiếm
                                    </v-btn>
                                </template>

                                <v-card>
                                    <v-card-title>
                                        <h4>Tìm kiếm lịch gửi</h4>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-text-field clearable v-model="healthIndexesSchedules.search.id" type="number" label="ID bệnh nhân"></v-text-field>
                                        <v-text-field clearable v-model="healthIndexesSchedules.search.name" label="Tên bệnh nhân"></v-text-field>
                                        <v-select v-model="healthIndexesSchedules.search.status" label="Trạng thái lịch gửi" :items="healthIndexesSchedules.allStatus"></v-select>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" text @click="healthIndexesSchedules.searchMenu =  false, healthIndexesSchedules.page = 1, getHealthIndexesSchedule(healthIndexesSchedules.page, healthIndexesSchedules.pageSize, healthIndexesSchedules.search)">Tìm kiếm</v-btn>
                                        <v-btn text color="red" @click="healthIndexesSchedules.searchMenu = false">Đóng</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.patient="{item}">
                        {{item.patient.name}}
                    </template>
                    <template v-slot:item.scheduledTime="{item}">
                        {{convertSecond(item.scheduledTime)}}
                    </template>
                    <template v-slot:item.status="{item}">
                        <span v-if="item.status == 0">Đang hoạt động</span>
                        <span v-else style="color: red">Đã xóa</span>
                    </template>
                    <template v-slot:item.more="{item}">
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">more_vert</v-icon>
                            </template>
                            <v-list>
                                <v-list-item @click="getDetailSchedule(item.id)">
                                    <v-list-item-title>Xem chi tiết</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="healthIndexesSchedules.deleteId = item.id, healthIndexesSchedules.deleteDialog = true">
                                    <v-list-item-title>Xóa lịch gửi</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                    <template v-slot:footer>
                        <br>
                        <div class="text-center">
                            <v-pagination
                                :total-visible="7"
                                v-model="healthIndexesSchedules.page"
                                :length="healthIndexesSchedules.pages"
                                @input="getHealthIndexesSchedule(healthIndexesSchedules.page, healthIndexesSchedules.pages, healthIndexesSchedules.search)"
                            ></v-pagination>
                        </div>
                        <br>
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
        <v-dialog max-width="700px" persistent v-model="healthIndexesSchedules.detailScheduleDialog">
            <v-card class="elevation-4" v-if="healthIndexesSchedules.detailSchedule != null">
                <v-card-title
                    class="headline primary"
                    primary-title
                    >
                    <span style="color: white">Chi tiết lịch gửi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <h3>Bệnh nhân: {{healthIndexesSchedules.detailSchedule.patient.name}}</h3>
                                <h3>Bác sĩ tạo lịch gửi: {{returnRole(healthIndexesSchedules.detailSchedule.doctor.role)}} {{healthIndexesSchedules.detailSchedule.doctor.name}}</h3>
                                <h3>Mô tả lịch gửi: {{healthIndexesSchedules.detailSchedule.description}}</h3>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <h3>Thông tin mẫu thông số sức khỏe</h3>
                                <h4>Tên: {{healthIndexesSchedules.detailSchedule.index.name}}</h4>
                                <h4>Mô tả: {{healthIndexesSchedules.detailSchedule.index.description}}</h4>
                                <h4>Các chỉ số cần gửi:</h4>
                                <div v-for="(field) in healthIndexesSchedules.detailSchedule.index.fields" :key="field.id" style="padding-left: 20px;">
                                    <h4> - {{field.name}} </h4>
                                </div>
                                <h4>Thời gian nhắc nhở: {{convertSecond(healthIndexesSchedules.detailSchedule.scheduledTime)}}</h4>
                                <h4>Thời gian bắt đầu gửi: {{returnTimeFromTimeArray(healthIndexesSchedules.detailSchedule.startedAt)}}</h4>
                                <h4>Thời gian kết thúc gửi: {{returnTimeFromTimeArray(healthIndexesSchedules.detailSchedule.endedAt)}}</h4>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="healthIndexesSchedules.detailScheduleDialog = false">Đóng</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            persistent
            v-model="healthIndexesSchedules.deleteDialog"
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
                    Bạn có chắc chắn muốn xóa lịch gửi này?
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red"
                    text
                    @click="healthIndexesSchedules.deleteDialog = false, deleteSchedule(healthIndexesSchedules.deleteId)"
                    >
                    XÓA
                </v-btn>
                <v-btn
                    color="primary"
                    text
                    @click="healthIndexesSchedules.deleteDialog = false, healthIndexesSchedules.deleteId = 0"
                    >
                    ĐÓNG
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-col cols="12" sm="12" md="12" lg="6" xl="6">
            <v-card class="elevation-4" height="100%">
                <v-data-table class="elevation-0" :headers="healthIndexesResult.headers" :items="healthIndexesResult.data" hide-default-footer no-data-text="Hiện tại chưa có kết quả nào" loading-text="Đang lấy dữ liệu..." :loading="healthIndexesResult.loading">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title><h3>Kết quả thông số bệnh nhân gửi</h3></v-toolbar-title>
                            <v-divider
                                class="mx-4"
                                inset
                                vertical
                            ></v-divider>
                            <v-spacer></v-spacer>
                            <v-menu
                                v-model="healthIndexesResult.searchMenu"
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
                                        <h4>Tìm kiếm lịch gửi</h4>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-text-field clearable v-model="healthIndexesResult.search.patient_id" type="number" label="ID bệnh nhân"></v-text-field>
                                        <v-text-field clearable v-model="healthIndexesResult.search.patient_name" label="Tên bệnh nhân"></v-text-field>
                                        <v-text-field clearable v-model="healthIndexesResult.search.scheduleId" type="number" label="ID lịch gửi"></v-text-field>
                                        <v-text-field clearable v-model="healthIndexesResult.search.index_id" type="number" label="ID thông số sức khỏe"></v-text-field>
                                        <v-text-field clearable v-model="healthIndexesResult.search.index_name" label="Tên mẫu thông số sức khỏe"></v-text-field>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" text @click="healthIndexesResult.searchMenu =  false, healthIndexesResult.page = 1, getHealthIndexesResult(healthIndexesResult.page, healthIndexesResult.pageSize, healthIndexesResult.search)">Tìm kiếm</v-btn>
                                        <v-btn text color="red" @click="healthIndexesResult.searchMenu = false">Đóng</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.schedule="{item}">
                        {{item.schedule.patient.name}}
                    </template>
                    <template v-slot:item.more="{item}">
                        <a @click.stop="getDetailHealthIndexesResultSchedule(item.schedule.id, item.tagId)">Xem chi tiết</a>
                    </template>
                    <template v-slot:footer>
                        <br>
                        <div class="text-center">
                            <v-pagination
                                :total-visible="7"
                                v-model="healthIndexesResult.page"
                                :length="healthIndexesResult.pages"
                                @input="getHealthIndexesResult(healthIndexesResult.page, healthIndexesResult.pages, healthIndexesResult.search)"
                            ></v-pagination>
                        </div>
                        <br>
                    </template> 
                </v-data-table>
            </v-card>
        </v-col>
        <v-dialog max-width="700px" persistent v-model="healthIndexesResult.detailResultDialog">
            <v-card class="elevation-4">
                <v-card-title
                    class="headline primary"
                    primary-title
                    >
                    <span style="color: white">Chi tiết kết quả</span>
                </v-card-title>
                <v-card-text v-if="healthIndexesResult.detailResult.schedule != null">
                    <v-container>
                        <h2>Thông tin lịch gửi</h2>
                        <v-row>
                            <v-col cols="12">
                                <h3>Bệnh nhân: {{healthIndexesResult.detailResult.schedule.patient.name}}</h3>
                                <h3>Bác sĩ tạo lịch gửi: {{returnRole(healthIndexesResult.detailResult.schedule.doctor.role)}} {{healthIndexesResult.detailResult.schedule.doctor.name}}</h3>
                                <h3>Mô tả lịch gửi: {{healthIndexesResult.detailResult.schedule.description}}</h3>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <h3>Thông tin mẫu thông số sức khỏe:</h3>
                                <h4>Tên: {{healthIndexesResult.detailResult.schedule.index.name}}</h4>
                                <h4>Mô tả: {{healthIndexesResult.detailResult.schedule.index.description}}</h4>
                                <h4>Các chỉ số cần gửi:</h4>
                                <div v-for="(field) in healthIndexesResult.detailResult.schedule.index.fields" :key="field.id" style="padding-left: 20px;">
                                    <h4> - {{field.name}} </h4>
                                </div>
                                <h4>Thời gian nhắc nhở: {{convertSecond(healthIndexesResult.detailResult.schedule.scheduledTime)}}</h4>
                                <h4>Thời gian bắt đầu gửi: {{returnTimeFromTimeArray(healthIndexesResult.detailResult.schedule.startedAt)}}</h4>
                                <h4>Thời gian kết thúc gửi: {{returnTimeFromTimeArray(healthIndexesResult.detailResult.schedule.endedAt)}}</h4>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-data-table class="elevation-4" :headers="healthIndexesResult.detailResult.headers" :items="healthIndexesResult.detailResult.result" hide-default-footer no-data-text="Hiện tại chưa có kết quả nào">
                                    <template v-slot:item.field="{item}">
                                        {{item.field.name}}
                                    </template>
                                    <template v-slot:item.createdAt="{item}">
                                        {{returnLocalTimeFromTimeArray(item.createdAt)}}
                                    </template>
                                    <template v-slot:top>
                                        <v-toolbar flat>
                                            <v-toolbar-title><h3>Kết quả</h3></v-toolbar-title>
                                            <v-divider
                                                class="mx-4"
                                                inset
                                                vertical
                                            ></v-divider>
                                        </v-toolbar>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="healthIndexesResult.detailResult.schedule = null, healthIndexesResult.detailResult.result = [], healthIndexesResult.detailResultDialog = false">Đóng</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import {mapGetters} from 'vuex'
import moment from 'moment';
import config from '../config'
import apiService from '../services/api.service'
export default {
    props: {

    },
    computed: {
        ...mapGetters({
            newNotification: 'newNotification',
            handleNotificationObj: 'handleNotificationObj',
            newSchedulePatientId: 'newSchedulePatientId',
            newScheduleDialog: 'newScheduleDialog'
        }),
        checkTimeScheduleAvailable(){
            let charArr = new Array(this.newSchedule.month, this.newSchedule.week, this.newSchedule.day, this.newSchedule.hour)
            // console.log(charArr)
            for(let i = 0; i < charArr.length; i++){
                if(charArr[i] != 0 && charArr[i] != ""){
                    return true
                }
            }
            return false
        }
    },
    watch:{
        newNotification(){
            this.handleNewNotification(this.newNotification)
        },
    },
    data(){
        return {
            healthIndexesSchedules: {
                data: [],
                page: 1,
                pages: 0,
                pageSize: 10,
                search: {
                    id: undefined,
                    status: 0,
                    name: undefined
                },
                allStatus: [
                    {
                        text: 'Đang hoạt động',
                        value: 0
                    },
                    {
                        text: 'Đã xóa',
                        value: 10
                    }
                ],
                searchMenu: false,
                headers: [
                    { text: 'ID', value: 'id' , align: 'start'},
                    { text: 'BỆNH NHÂN', value: 'patient', align: 'start' },
                    { text: 'THỜI GIAN NHẮC', value: 'scheduledTime', align: 'start' },
                    { text: 'TRẠNG THÁI', value: 'status', align: 'start' },
                    { text: 'MÔ TẢ', value: 'description', align: 'start'},
                    { text: 'HÀNH ĐỘNG', value: 'more', align: 'end' },
                ],
                loading: false,
                deleteId: 0,
                deleteDialog: false,
                detailSchedule: null,
                detailScheduleDialog: false,
            },
            newSchedule: {
                month: '',
                week: '',
                day: '',
                hour: '',
                description: '',
                startDate: '',
                startDateMenu: false,
                startTime: '08:00',
                startTimeMenu: false,
                indexObj: []
            },
            healthIndexes: [],
            healthIndexesHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'MÔ TẢ', value: 'description', align: 'start' },
                { text: '', value: 'data-table-expand' },
            ],
            loadingHealthIndexes: false,
            detailHealthIndexes: null,
            healthIndexesPage: 1,
            healthIndexesPages: 0,
            healthIndexesPageSize: 10,
            healthIndexesResult: {
                data: [],
                page: 1,
                pages: 0,
                pageSize: 10,
                loading: false,
                headers: [
                    { text: 'MÃ KẾT QUẢ', value: 'tagId' , align: 'start'},
                    { text: 'BỆNH NHÂN', value: 'schedule', align: 'start' },
                    { text: 'HÀNH ĐỘNG', value: 'more', align: 'end' },
                ],
                search: {
                    patient_id: undefined,
                    patient_name: undefined,
                    scheduleId: undefined,
                    index_id: undefined,
                    index_name: undefined
                },
                searchMenu: false,
                detailResult: {
                    schedule: null,
                    result: [],
                    headers: [
                        { text: 'CHỈ SỐ', value: 'field' , align: 'start'},
                        { text: 'KẾT QUẢ', value: 'value', align: 'start'},
                        { text: 'THỜI GIAN GỬI', value: 'createdAt', align: 'start'},
                    ]
                },
                detailResultDialog: false
            },
        }
    },
    methods: {
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
        returnLocalTimeFromTimeArray(arr){
            try {
                let i = 0;
                let dayArr = []
                let timeArr = []
                while(i < arr.length){
                    if(i < 3){
                        dayArr.push(arr[i])
                    }
                    else {
                        timeArr.push(arr[i])
                    }
                    i++
                }
                let timeString = `${dayArr.join('-')} ${timeArr.join(':')}`
                return moment.utc(timeString).local().format('HH:mm:ss DD/MM/YYYY')
            }
            catch(error){
                console.log(error)
                return "_"
            }
        },
        returnTimeFromTimeArray(arr){
            try {
                let i = 0;
                let dayArr = []
                let timeArr = []
                while(i < arr.length){
                    if(i < 3){
                        dayArr.push(arr[i])
                    }
                    else {
                        timeArr.push(arr[i])
                    }
                    i++
                }
                let timeString = `${dayArr.join('-')} ${timeArr.join(':')}`
                return moment(timeString).format('HH:mm:ss DD/MM/YYYY')
            }
            catch(error){
                console.log(error)
                return "_"
            }
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
        convertSecond(sec){
            let month = Math.floor(sec/ 18144000)
            let monthStr = (month == 0) ? '' : `${month} tháng `
            let week = Math.floor((sec % 18144000)/ 604800)
            let weekStr = (week == 0) ? '' : `${week} tuần `
            let day = Math.floor((sec % 18144000 % 604800) / 86400)
            let dayStr = (day == 0) ? '' : `${day} ngày `
            let hour = Math.floor((sec % 18144000 % 604800 % 86400) / 3600)
            let hourStr = (hour == 0) ? '' : `${hour} giờ `
            let result = monthStr + weekStr + dayStr + hourStr
            return result
        },
        getHealthIndexes(page, size){
            this.healthIndexes = []
            this.loadingHealthIndexes = true
            let params = {
                page: page,
                size: size
            }
            let url = `${config.apiUrl}/health_indexes`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.healthIndexesPages = result.data.totalPages
                    this.healthIndexes = result.data.content
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
                this.loadingHealthIndexes = false;
            })
        },
        getHealthIndexesSchedule(page, size, searchObj){
            this.healthIndexesSchedules.data = []
            this.healthIndexesSchedules.loading = true;
            let params = {
                page: page,
                size: size
            }
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
            let url = `${config.apiUrl}/health_indexes/schedule`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.healthIndexesSchedules.data = result.data.content
                    this.healthIndexesSchedules.pages = result.data.totalPages
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
                this.healthIndexesSchedules.loading = false
            })
        },
        getHealthIndexesResult(page, size, searchObj){
            this.healthIndexesResult.data = []
            this.healthIndexesResult.loading = true
            let params = {
                page: page,
                size: size
            }
            let searchString = '';
            //Loop through all property of patientSearch Obj
            for (const property in searchObj) {
                if(searchObj[property] != undefined && searchObj[property] != null && searchObj[property] != ''){
                    searchString += `${property}=${searchObj[property]},`
                }
            }
            if(searchString != ''){
                params.search = searchString
            }
            let url = `${config.apiUrl}/health_indexes/result`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.healthIndexesResult.data = result.data.content
                    this.healthIndexesResult.pages = result.data.totalPages
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
                this.healthIndexesResult.loading = false
            })
        },
        closeNewScheduleDialog(){
            this.$store.dispatch('resetNewScheduleObj')
        },
        createSchedule(scheduleObj){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang tạo lịch gửi mới...')
            let scheduled = 0;
            if(scheduleObj.month != ''){
                scheduled += parseInt(scheduleObj.month) * 18144000
            }
            if(scheduleObj.week != ''){
                scheduled += parseInt(scheduleObj.week) * 604800
            }
            if(scheduleObj.day != ''){
                scheduled += parseInt(scheduleObj.day) * 86400
            }
            if(scheduleObj.hour != ''){
                scheduled += parseInt(scheduleObj.hour) * 3600
            }
            let body = {
                "description": scheduleObj.description,
                "index_id": scheduleObj.indexObj[0].id,
                "patient_id": this.newSchedulePatientId,
                "scheduled": scheduled,
                "start": `${scheduleObj.startDate.split("-").reverse().join("/")} ${scheduleObj.startTime}:00`
            }
            let url = `${config.apiUrl}/health_indexes/schedule`
            this.closeNewScheduleDialog()
            apiService.postApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Tạo lịch gửi thành công',
                        type: 'success',
                    })
                    this.healthIndexesSchedules.page = 1;
                    this.healthIndexesSchedules.search = {
                        id: undefined,
                        status: undefined,
                        name: undefined
                    }
                    this.getHealthIndexesSchedule(this.healthIndexesSchedules.page, this.healthIndexesSchedules.pageSize, this.healthIndexesSchedules.search)
                    
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
        deleteSchedule(scheduleId){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang xóa lịch gửi...')
            let url = `${config.apiUrl}/health_indexes/schedule`
            let body = {
                id: scheduleId
            }
            apiService.deleteApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Xóa lịch gửi thành công',
                        type: 'error',
                    })
                    this.healthIndexesSchedules.page = 1;
                    this.getHealthIndexesSchedule(this.healthIndexesSchedules.page, this.healthIndexesSchedules.pageSize, this.healthIndexesSchedules.search)
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
        getDetailSchedule(scheduleId){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang lấy thông tin chi tiết lịch gửi...')
            let url = `${config.apiUrl}/health_indexes/schedule/${scheduleId}`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.healthIndexesSchedules.detailSchedule = result.data
                    this.healthIndexesSchedules.detailScheduleDialog = true
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
        getDetailHealthIndexesResultSchedule(scheduleId, tagId){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang lấy thông tin chi tiết kết quả...')
            let url = `${config.apiUrl}/health_indexes/schedule/${scheduleId}`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.healthIndexesResult.detailResult.schedule = result.data
                    this.getDetailHealthIndexesResult(tagId)
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
        getDetailHealthIndexesResult(tagId){
            let url = `${config.apiUrl}/health_indexes/result/${tagId}`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.healthIndexesResult.detailResult.result = result.data
                    this.healthIndexesResult.detailResultDialog = true
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
        handleNewNotification(e){
            let url = `${config.apiUrl}/notifications/${e.notificationId}`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    let type = result.data.type
                    // let payloadId = result.data.payloadId
                    switch(type){
                        //patient send health indexes
                        case 8: {
                            this.healthIndexesResult.page = 1;
                            this.healthIndexesResult.search = {
                                patient_id: undefined,
                                patient_name: undefined,
                                scheduleId: undefined,
                                index_id: undefined,
                                index_name: undefined
                            }
                            this.getHealthIndexesResult(this.healthIndexesResult.page,  this.healthIndexesResult.pageSize, this.healthIndexesResult.search)
                            break;
                        }
                        default: {
                            console.log(type)
                            break;
                        }
                    }
                }
            }).catch(error => {
                console.log(error)
            })
        },
    },
    created(){
        this.newSchedule.startDate = new Date().toISOString().substr(0, 10)
        this.getHealthIndexesSchedule(this.healthIndexesSchedules.page, this.healthIndexesSchedules.pageSize, this.healthIndexesSchedules.search)
        this.getHealthIndexesResult(this.healthIndexesResult.page, this.healthIndexesResult.pageSize, this.healthIndexesResult.search)
        this.getHealthIndexes(this.healthIndexesPage, this.healthIndexesPageSize)
    }
}
</script>
<style scoped>

</style>