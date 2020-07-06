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
                    <v-data-table class="elevation-0" no-data-text="Không có yêu cầu tư vấn nào" loading-text="Đang lấy dữ liệu" :loading="loadingInquiries" :headers="inquiryHeadersMain" :items="inquiries" hide-default-footer>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title><h3>Yêu cầu tư vấn</h3></v-toolbar-title>
                                <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                ></v-divider>
                                <v-spacer></v-spacer>
                                <!-- <v-select :items="inquiryAssignValue" v-model="inquiryAssign" @input="inquiryPage = 1, getInquiries(inquiryPage, inquiryPageSize, inquiryAssign)"></v-select> -->
                            </v-toolbar>
                        </template>
                        <template v-slot:footer>
                            <br>
                            <div class="text-center">
                                <v-pagination
                                    :total-visible="7"
                                    v-model="inquiryPage"
                                    :length="inquiryPages"
                                    @input="getInquiries(inquiryPage, inquiryPageSize, inquiryAssign)"
                                ></v-pagination>
                            </div>
                            <br>
                        </template>
                        <template v-slot:item.patient="{ item }">
                            {{ item.patient.name }}
                        </template>
                        <template v-slot:item.type="{ item }">
                            {{ returnInquiryType(item.type) }}
                        </template>
                        <template v-slot:item.more="{item}">
                            <a @click.stop="getDetailInquiry(item.id)">Xem</a>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
            <v-col cols="12" md="12" sm="12" lg="6" xl="6">
                <v-card class="elevation-4" height="100%">
                    <v-data-table class="elevation-0" no-data-text="Không có kết quả phù hợp" loading-text="Đang lấy dữ liệu" :loading="loadingPatient" v-show="showPatient" :headers="patientHeaders" :items="allPatients" hide-default-footer>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title><h3>Bệnh nhân quản lý</h3></v-toolbar-title>
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
                                    <v-list-item @click="newSchedule.patientId = item.id, newScheduleDialog = true">
                                        <v-list-item-title>Tạo lịch gửi thông số sức khỏe</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="removePatientObj.id = item.id, removePatientObj.dialog = true">
                                        <v-list-item-title>Xóa bệnh nhân khỏi quyền quản lý</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
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
        <v-row>
            <v-col cols="12" sm="12" md="12" lg="6" xl="6">
                <v-card height="100%" class="elevation-4">
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
                                            <v-btn color="blue darken-1" text :disabled="(!checkTimeScheduleAvailable) || (newSchedule.indexObj.length == 0)" @click="newScheduleDialog = false, createSchedule(newSchedule)">TẠO</v-btn>
                                            <v-btn color="red" text @click="newScheduleDialog = false">ĐÓNG</v-btn>
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
                        <template v-slot:item.createdAt="{}">
                            _
                            <!-- {{returnTimeFromTimeArray(item.createdAt)}} -->
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
                                <v-col cols="12">
                                    <h3>Các căn bệnh hiện tại:</h3>
                                    <h3 :key="disease.id" v-for="disease in patientDetail.diseases"> - {{disease.name}}</h3>
                                </v-col>
                            </v-row>
                            <v-row v-if="patientDetail.id != '' && patientDetail.id != 0">
                                <v-col cols="12">
                                    <h3>
                                        <a @click="patientInquiryHistoryDialog = true">LỊCH SỬ TƯ VẤN</a>
                                        <br>
                                        <a @click="newSchedule.patientId = patientDetail.id, newScheduleDialog = true">TẠO LỊCH GỬI THÔNG SỐ SỨC KHỎE</a>
                                        <br>
                                        <br>
                                        <a style="color: red" @click="removePatientObj.id = patientDetail.id, removePatientObj.dialog = true">XÓA BỆNH NHÂN KHỎI QUYỀN QUẢN LÝ</a>
                                    </h3>
                                </v-col>
                                <v-dialog scrollable v-model="patientInquiryHistoryDialog" max-width="1000px" persistent>
                                    <v-card>
                                        <v-card-title
                                            class="headline primary"
                                            primary-title
                                            >
                                            <span style="color: white">Lịch sử tư vấn</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-row v-if="patientDetail.id != '' && patientDetail.id != 0">
                                                        <v-col cols="12">
                                                            <v-data-table hide-default-footer class="elevation-4" :items="patientDetail.inquiries" :headers="patientInquiryHistoryHeaders">
                                                                <!-- <template v-slot:top>
                                                                    <v-toolbar flat>
                                                                        <v-toolbar-title><h3>Yêu cầu tư vấn</h3></v-toolbar-title>
                                                                        <v-divider
                                                                            class="mx-4"
                                                                            inset
                                                                            vertical
                                                                        ></v-divider>
                                                                    </v-toolbar>
                                                                </template> -->
                                                                <template v-slot:item.patient="{ item }">
                                                                    {{item.patient.name}}
                                                                </template>
                                                                <template v-slot:item.createdAt="{ item }">
                                                                    {{returnTimeFromTimeArray(item.createdAt)}}
                                                                </template>
                                                                <template v-slot:item.type="{ item }">
                                                                    {{ returnInquiryType(item.type) }}
                                                                </template>
                                                                
                                                                <template v-slot:item.more="{item}">
                                                                    <a @click="patientInquiryHistoryDialog = false, getDetailInquiry(item.id)">Xem chi tiết >></a>
                                                                </template>
                                                            </v-data-table>
                                                        </v-col>
                                                    </v-row>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="red" text @click="patientInquiryHistoryDialog = false">ĐÓNG</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
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
                                <h3 v-if="detailInquiry.type == 0">Thời gian làm xét nghiệm: {{returnTimeFromTimeArray(detailInquiry.date)}}</h3>
                                <h3 v-if="detailInquiry.type == 1">Thời gian ăn: {{returnTimeFromTimeArray(detailInquiry.date)}}</h3>
                                <h3>Ảnh: </h3>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <h3 v-if="images.length > 0">Ảnh bệnh nhân cung cấp </h3>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" lg="3" xl="3" v-for="image in images" :key="image">
                                <v-img max-height="90%" max-width="90%" :src="image" @click="showImage.link = image, showImage.dialog = true"></v-img>
                            </v-col>
                            <v-dialog v-model="showImage.dialog" persistent>
                                <v-card>
                                    <v-card-title
                                        class="headline primary"
                                        primary-title
                                        >
                                        <span style="color: white">Ảnh</span>
                                        <v-spacer></v-spacer>
                                        <v-btn icon dark @click="showImage.dialog = false, showImage.link = ''">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                    <v-img :src="showImage.link"></v-img>
                                </v-card>
                            </v-dialog>
                        </v-row>
                        <v-row>
                            <v-col v-for="(record) in detailInquiry.medicalRecords" :key="record.id" cols="12">
                                <v-card class="elevation-4">
                                    <v-card-title>Tư vấn của {{returnRole(record.doctor.role)}} {{record.doctor.name}}</v-card-title>
                                    <v-card-text>
                                        <h3>
                                            Chẩn đoán: {{record.diagnose}}
                                            <br>
                                            Kê đơn: {{record.prescription}}
                                            <br>
                                            Ghi chú: {{record.note}}
                                            <br>
                                            Trạng thái: <span v-if="record.status == 0" style="color: red">Đang chờ bác sĩ đa khoa duyệt</span>
                                            <span v-else style="color: green">Đã được bác sĩ đa khoa duyệt</span>
                                        </h3>
                                    </v-card-text>
                                    <!-- <v-card-actions v-if="record.specialist && record.specialist.id == $store.state.user.id">
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" rounded @click="openEditRecordDialog(record.id, index, true)">Chỉnh sửa tư vấn</v-btn>
                                    </v-card-actions> -->
                                </v-card>
                            </v-col>
                            <v-col v-for="(record) in detailInquiry.dietRecords" :key="record.id" cols="12">
                                <v-card class="elevation-4">
                                    <v-card-title>Tư vấn của {{returnRole(record.doctor.role)}} {{record.doctor.name}}</v-card-title>
                                    <v-card-text>
                                        <h3>
                                            Kê đơn: {{record.prescription}}
                                            <br>
                                            Ghi chú: {{record.note}}
                                            <br>
                                            Trạng thái: <span v-if="record.status == 0" style="color: red">Đang chờ bác sĩ đa khoa duyệt</span>
                                            <span v-else style="color: green">Đã được duyệt</span>
                                        </h3>
                                    </v-card-text>
                                    <!-- <v-card-actions v-if="record.dietitian && record.dietitian.id == $store.state.user.id">
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" rounded @click="openEditRecordDialog(record.id, index, false)">Chỉnh sửa tư vấn</v-btn>
                                    </v-card-actions> -->
                                </v-card>
                            </v-col>
                        </v-row>
                        <br>
                        <v-btn @click="openNewRecordDialog(detailInquiry.id, detailInquiry.type)" rounded color="primary">Thêm tư vấn mới</v-btn>
                        <br>
                        <br>
                        <v-card class="elevation-4">
                            <v-card-title>
                                Giải đáp thắc mắc
                            </v-card-title>
                            <v-card-text>
                                <div :key="reply.id" v-for="reply in detailInquiry.replies" style="margin: 10px; padding: 10px; border: 1px solid grey; border-radius: 10px;">
                                    <h4>{{reply.user.name}} ({{returnRole(reply.user.role)}}) </h4>
                                    <p>{{reply.content}}</p> 
                                </div>
                            </v-card-text>
                            <v-card-actions v-show="user.role == 'DIETITIAN'">
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-textarea v-model="replyText" background-color="#CFD8DC" label="Nhập câu trả lời tại đây..." outlined rows="4"></v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-btn :disabled="replyText == ''" color="primary" @click="addReply(detailInquiry.id, replyText)" >Trả lời</v-btn>
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
                                <span style="color: white">Tạo tư vấn mới</span>
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
                                <span style="color: white">Chỉnh sửa tư vấn </span>
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
import moment from 'moment'
import {mapGetters} from 'vuex'
import apiService from '../../services/api.service'
import config from '../../config'
export default {
    data(){
        return {
            images: [],
            showImage: {
                link: '',
                dialog: false,
            },
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
                diseases: []
            },
            patientInquiryHistoryDialog: false,
            patientInquiryHistoryHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN BỆNH NHÂN', value: 'patient', align: 'start' },
                { text: 'KIỂU YÊU CẦU', value: 'type', align: 'start' },
                { text: 'NỘI DUNG', value: 'content', align: 'start' },
                { text: 'THỜI GIAN TẠO', value: 'createdAt', align: 'start'},
                { text: 'XEM CHI TIẾT', value: 'more', align: 'start'}
            ],
            inquiryHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'BỆNH NHÂN', value: 'patient', align: 'start' },
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
                    text: 'Đã được đặt lịch gửi thông số sức khỏe',
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
                { text: 'BỆNH NHÂN', value: 'patient', align: 'start' },
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
            newScheduleDialog: false,
            newSchedule: {
                patientId: 0,
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
                    { text: 'ID', value: 'tagId' , align: 'start'},
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
    computed: {
        ...mapGetters({
            newNotification: 'newNotification',
            handleNotificationObj: 'handleNotificationObj',
            user: 'user'
        }),
        checkTimeScheduleAvailable(){
            let charArr = new Array(this.newSchedule.month, this.newSchedule.week, this.newSchedule.day, this.newSchedule.hour)
            for(let i = 0; i < charArr.length; i++){
                if(charArr[i] != 0 && charArr[i] != ""){
                    return true
                }
            }
            return false
        }
    },
    watch: {
        newNotification(){
            this.handleNewNotification(this.newNotification)
        },

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
        scrollBottom() {
			window.scrollTo(0,document.body.scrollHeight)
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
            let status = 0;
            for(let i = 0; i < this.patientAllStatus.length; i++){
                if(this.patientAllStatus[i].value == true){
                    status += this.patientAllStatus[i].key
                }
            }
            if(status != 0){
                searchString += `status=${status},`
            }
            params.search = searchString
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
                    })
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
            this.scrollBottom()
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
        getPatientDetailAfterGetInquiry(id, isDetail){
            this.scrollBottom()
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
                    })
                }
            }).catch(error => {
                console.log(error)
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
            this.patientDetail.diseases = data.diseases
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
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                    })
                }
            }).catch(error => {
                this.$toast.open({
                    message: error,
                    type: 'error',
                })
            })
        },
        getDetailInquiry(id){
            this.scrollBottom()
            this.detailInquiry = null;
            this.images = [];
            this.$store.dispatch('turnOnLoadingDialog', 'Đang lấy thông tin chi tiết yêu cầu tư vấn...')
            let url = `${config.apiUrl}/inquiries/${id}`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.detailInquiry = result.data
                    if(this.detailInquiry.albumId != null){
                        this.getImages(this.detailInquiry.albumId)
                    }
                    this.getPatientDetailAfterGetInquiry(result.data.patient.id, true)
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                    })
                }
            }).catch(error => {
                this.$toast.open({
                    message: error,
                    type: 'error',
                })
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
        },
        getImages(albumId){
            let params = {
                album_id: albumId
            }
            let url = `${config.apiUrl}/images`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.images = result.data
                }
                else {
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                    })
                }
            }).catch(error => {
                console.log(error)
            })
        },
        addReply(inquiryId, reply){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang thêm câu trả lời...')
            let body = {
                "inquiry_id": inquiryId,
                reply: reply
            }
            
            let url = `${config.apiUrl}/replies`
            apiService.postApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.detailInquiry.replies.push(result.data)
                    this.replyText = ''
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
                    this.$toast.open({
                        message: 'Chỉnh sửa tư vấn thành công',
                        type: 'success',
                    })
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
            this.$store.dispatch('turnOnLoadingDialog', 'Đang tạo tư vấn...')
            apiService.postApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Tư vấn thành công',
                        type: 'success',
                    })
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
        removePatient(id){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang xóa khỏi quyền quản lý...')
            let url = `${config.apiUrl}/patients/${id}/doctor`
            apiService.deleteApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Xóa quyền quản lý thành công',
                        type: 'success',
                    })
                    if(this.patientDetail.id == id){
                        this.patientDetail = {
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
                            diseases: []
                        }
                        this.detailInquiry = null
                    }
                    this.patientPage = 1;
                    this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
                    this.inquiryPage = 1;
                    this.getInquiries(this.inquiryPage, this.inquiryPageSize, this.inquiryAssign)
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
                    this.$toast.open({
                        message: result.data.message,
                        type: 'error',
                    })
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.loadingInquiries = false;
            })
        },
        logging(){
            console.log(this.patientDetail)
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
                "patient_id": scheduleObj.patientId,
                "scheduled": scheduled,
                "start": `${scheduleObj.startDate.split("-").reverse().join("/")} ${scheduleObj.startTime}:00`
            }
            let url = `${config.apiUrl}/health_indexes/schedule`
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
                        type: 'success',
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
        getRepliesFromNewNotification(inquiryId){
            let url = `${config.apiUrl}/inquiries/${inquiryId}`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    if(this.detailInquiry != null && this.detailInquiry.id == result.data.id){
                        this.detailInquiry.replies = result.data.replies
                    }  
                }
            }).catch(error => {
                console.log(error)
            })
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
        handleNewNotification(e){
            let url = `${config.apiUrl}/notifications/${e.notificationId}`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    let type = result.data.type
                    let payloadId = result.data.payloadId
                    switch(type){
                        //patient send new inquiry
                        case 0: {
                            this.inquiryPage = 1;
                            this.inquiryAssign = true;
                            this.getInquiries(this.inquiryPage, this.inquiryPageSize, this.inquiryAssign)
                            break;
                        }
                        //new reply
                        case 2: {
                            this.getRepliesFromNewNotification(payloadId)
                            break;
                        }
                        //assigned new patient or a patient has been deactivated
                        case 3: {
                            this.patientPage = 1;
                            this.patientSearch = {
                                name: undefined,
                                status: 0,
                                gender: undefined,
                                age: undefined
                            }
                            this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
                            this.inquiryPage = 1;
                            this.getInquiries(this.inquiryPage, this.inquiryPageSize, this.inquiryAssign)
                            break;
                        }
                        //patient send health indexes result
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
                        //a patient has been deactivated
                        case 10: {
                            if(payloadId == this.patientDetail.id){
                                this.patientDetail = {
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
                                    diseases: []
                                }
                                this.detailInquiry = null
                            }
                            this.patientPage = 1;
                            this.patientSearch = {
                                name: undefined,
                                status: 0,
                                gender: undefined,
                                age: undefined
                            }
                            this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
                            this.inquiryPage = 1;
                            this.getInquiries(this.inquiryPage, this.inquiryPageSize, this.inquiryAssign)
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
        checkComeFromNotiPage(){
            let typeNoti = this.handleNotificationObj.typeNoti
            let payloadId = this.handleNotificationObj.payloadId
            if(typeNoti != -1){
                switch(typeNoti){
                    //0: new inquiry
                    //2:new reply
                    //3: assigned new patient
                    //8: patient send health indexes result
                    case 0: 
                    case 2:
                    case 3: {
                        this.getDetailInquiry(payloadId)
                        break;
                    }
                    case 8: {
                        this.getDetailHealthIndexesResult(payloadId)
                        break
                    }
                    case 10: {
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
        this.newSchedule.startDate = new Date().toISOString().substr(0, 10)
        this.checkComeFromNotiPage()
        this.getInquiries(this.inquiryPage, this.inquiryPageSize, this.inquiryAssign)
        this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
        this.getHealthIndexesSchedule(this.healthIndexesSchedules.page, this.healthIndexesSchedules.pageSize, this.healthIndexesSchedules.search)
        this.getHealthIndexesResult(this.healthIndexesResult.page, this.healthIndexesResult.pageSize, this.healthIndexesResult.search)
        this.getHealthIndexes(this.healthIndexesPage, this.healthIndexesPageSize)
    }
}
</script>
<style scoped>

</style>