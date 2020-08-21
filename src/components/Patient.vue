<template>
    <v-container>
        <v-row>
            <v-col>
                <h1 v-if="user != null">Chức năng dành cho Bác sĩ {{(user.role == 'PRACTITIONER') ? 'Đa khoa' : 'Chuyên khoa/Dinh dưỡng'}}</h1>
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
                                <v-select v-if="user != null && user.role == 'PRACTITIONER'" :items="inquiryAssignValue" v-model="inquiryAssign" @input="inquiryPage = 1, getInquiries(inquiryPage, inquiryPageSize, inquiryAssign)"></v-select>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.patient="{ item }">
                            {{ item.patient.name }}
                        </template>
                        <template v-slot:item.type="{ item }">
                            {{ returnInquiryType(item.type) }}
                        </template>
                        <template v-slot:item.more="{item}" v-if="user != null">
                            <v-menu offset-y v-if="user.role == 'PRACTITIONER'">
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on">more_vert</v-icon>
                                </template>
                                <v-list>
                                    <v-list-item @click="getDetailInquiry(item.id)">
                                        <v-list-item-title>Xem chi tiết</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="openAssignToDoctorMainDialog(item)"><v-list-item-title>Yêu cầu hội chẩn chuyên khoa</v-list-item-title></v-list-item>
                                </v-list>
                            </v-menu>
                            <a v-else @click.stop="getDetailInquiry(item.id)">Xem</a>
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
                    </v-data-table>
                </v-card>
                <v-dialog scrollable v-model="assignToDoctorDialogMain" max-width="700px" persistent>
                    <v-card>
                        <v-card-title
                            class="headline primary"
                            primary-title
                            >
                            <span style="color: white">Yêu cầu hội chẩn chuyên khoa</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col  sm="12" md="12" lg="12" xl="12">
                                        <v-data-table
                                            hide-default-footer
                                            v-model="selectedInquiryMain"
                                            :headers="inquiryHeaders"
                                            :items="selectInquiryMain"
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
                                    <v-col sm="12" md="12" lg="12" xl="12">
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
                            <v-btn color="blue" text :disabled="selectedInquiryMain.length == 0 || selectedDoctor == 0" @click="assignToPrac(selectedInquiryMain[0].patient.id, selectedInquiryMain, selectedDoctor), assignToDoctorDialogMain = false, selectedInquiryMain = [], selectedDoctor = [], selectInquiryMain = []">GÁN</v-btn>
                            <v-btn color="red" text @click="assignToDoctorDialogMain = false, selectedInquiryMain = [], selectedDoctor = [], selectInquiryMain = []">ĐÓNG</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
            <v-col cols="12" md="12" sm="12" lg="6" xl="6">
                <v-card class="elevation-4" height="100%">
                    <v-data-table class="elevation-0" no-data-text="Không có kết quả phù hợp" loading-text="Đang lấy dữ liệu" :loading="loadingPatient" :headers="patientHeaders" :items="allPatients" hide-default-footer>
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
                                        text
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
                                            <span v-if="user != null && user.role == 'PRACTITIONER'">
                                                <v-checkbox @change="setPatientStatusBit(6, patientStatusBitAllValue[6])" v-model="patientStatusBitAllValue[6]" label="Tất cả bệnh nhân quản lý"></v-checkbox>
                                                <!-- <v-checkbox @change="setPatientStatusBit(5, patientStatusBitAllValue[5])" v-model="patientStatusBitAllValue[5]" label="Bệnh nhân chỉ có bác sĩ đa khoa"></v-checkbox> -->
                                                <v-checkbox @change="setPatientStatusBit(2, patientStatusBitAllValue[2])" v-model="patientStatusBitAllValue[2]" label="Bệnh nhân có bác sĩ chuyên khoa"></v-checkbox>
                                                <v-checkbox @change="setPatientStatusBit(3, patientStatusBitAllValue[3])" v-model="patientStatusBitAllValue[3]" label="Bệnh nhân có bác sĩ dinh dưỡng"></v-checkbox>
                                                <v-checkbox @change="setPatientStatusBit(4, patientStatusBitAllValue[4])" v-model="patientStatusBitAllValue[4]" label="Bệnh nhân có lịch gửi thông số sức khỏe"></v-checkbox>
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
                                    <v-list-item @click="getPatientDetail(item.id, false)" v-if="user != null && user.role == 'PRACTITIONER'"><v-list-item-title>Gán bệnh nhân</v-list-item-title></v-list-item>
                                    <v-list-item @click="openNewScheduleDialog(item.id)">
                                        <v-list-item-title>Tạo lịch gửi thông số sức khỏe</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="removePatientObj.id = item.id, removePatientObj.dialog = true"><v-list-item-title>Xóa bệnh nhân khỏi quyền quản lý</v-list-item-title></v-list-item>
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
                <v-dialog scrollable v-model="assignToDoctorDialog" max-width="700px" persistent>
                    <v-card>
                        <v-card-title
                            class="headline primary"
                            primary-title
                            >
                            <span style="color: white">Gán quyền quản lý bệnh nhân cho Bác sĩ chuyên khoa/dinh dưỡng</span>
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
                            <v-btn color="blue" text :disabled="selectedInquiry.length == 0 || selectedDoctor == 0" @click="assignToPrac(patientDetail.id, selectedInquiry, selectedDoctor), assignToDoctorDialog = false, selectedInquiry = [], selectedDoctor = []">GÁN</v-btn>
                            <v-btn color="red" text @click="assignToDoctorDialog = false, selectedInquiry = [], selectedDoctor = []">ĐÓNG</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
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
                                        <a v-if="user != null && user.role == 'PRACTITIONER'" @click="getPatientDetail(patientDetail.id, false)">GÁN BỆNH NHÂN</a>
                                        <br v-if="user != null && user.role == 'PRACTITIONER'">
                                        <a @click="openNewScheduleDialog(patientDetail.id)">TẠO LỊCH GỬI THÔNG SỐ SỨC KHỎE</a>
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
                            <v-col v-for="(record, index) in detailInquiry.medicalRecords" :key="record.id" cols="12">
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
                                            Trạng thái: <span v-if="record.status == 0" style="color: red">Đang chờ duyệt</span>
                                            <span v-else style="color: green">Đã được duyệt</span>
                                        </h3>
                                    </v-card-text>
                                    <v-card-actions v-if="user != null && user.role == 'PRACTITIONER'">
                                        <v-spacer></v-spacer>
                                        <v-btn v-if="record.status != 2" color="primary" rounded @click="openEditRecordDialog(record.id, index, true)">Duyệt tư vấn</v-btn>
                                    </v-card-actions>
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
                                            Trạng thái: <span v-if="record.status == 0" style="color: red">Đang chờ duyệt</span>
                                            <span v-else style="color: green">Đã được duyệt</span>
                                        </h3>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <!-- edit record dialog -->
                            <v-dialog max-width="700px" v-model="editRecord.dialog" persistent>
                                <v-card class="elevation-4" v-if="editRecord.obj != null">
                                    <v-card-title
                                        class="headline primary"
                                        primary-title
                                        >
                                        <span style="color: white">Duyệt tư vấn</span>
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
                                        <v-btn color="blue" v-if="editRecord.isMedical == true" :disabled="editRecord.obj.diagnose == '' || editRecord.obj.prescription == ''|| editRecord.obj.note ==''" text @click="updateRecord(editRecord.recordId, editRecord.recordIndex, editRecord.isMedical, editRecord.obj.prescription, editRecord.obj.note, editRecord.obj.diagnose), editRecord.dialog = false, editRecord.obj = null">DUYỆT</v-btn>
                                        <v-btn color="blue" v-if="editRecord.isMedical == false" :disabled="editRecord.obj.prescription == ''|| editRecord.obj.note ==''" text @click="updateRecord(editRecord.recordId, editRecord.recordIndex, editRecord.isMedical, editRecord.obj.prescription, editRecord.obj.note), editRecord.dialog = false, editRecord.obj = null">DUYỆT</v-btn>
                                        <v-btn color="red" text @click="editRecord.dialog = false, editRecord.obj = null">Đóng</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
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
                        </v-row>
                        <br>
                        <v-btn v-if="user != null && user.role != 'PRACTITIONER'" @click="openNewRecordDialog(detailInquiry.id, detailInquiry.type)" rounded color="primary">Thêm tư vấn mới</v-btn>
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
                            <v-card-actions v-if="(user != null) && (user.role == 'PRACTITIONER' || user.role == 'DIETITIAN')">
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-textarea v-model="replyText" background-color="#CFD8DC" label="Thêm câu trả lời tại đây..." outlined rows="4"></v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-btn :disabled="replyText == ''" color="primary" @click="addReply(detailInquiry.id, replyText)">Trả lời</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                <br>
                            </v-card-actions>
                        </v-card>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import {mapGetters} from 'vuex'
import apiService from '../services/api.service'
import config from '../config'
import func from '../helpers/common_function'
var convertNumber = require('decimal-to-binary')
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
            assignToDoctorDialog: false,
            inquiryHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN BỆNH NHÂN', value: 'patient', align: 'start' },
                { text: 'KIỂU YÊU CẦU', value: 'type', align: 'start' },
                { text: '', value: 'data-table-expand' },
            ],
            patientSearch: {
                name: undefined,
                status: -1,
                gender: undefined,
                age: undefined,
            },
            patientSearchMenu: false,
            patientStatusBitAllValue: [false, false, false, false, false, false, false, false, false, false, false, false],
            detailInquiry: null,
            replyText: '',
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
            doctorHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'EMAIL', value: 'email', align: 'start' },
                { text: 'SỐ ĐT', value: 'phoneNumber', align: 'start' },
                // { text: 'GIỚI TÍNH', value: 'gender', align: 'start' },
                // { text: 'HÀNH ĐỘNG', value: 'more', align: 'right' },
            ],
            allSpecialist: [],
            allDietitian: [],
            selectedInquiry: [],
            selectableDoctor: [],
            selectDoctorTitle: 'Chọn Bác sĩ để gán',
            selectedDoctor: [],
            editRecord: {
                obj: null,
                recordId: 0,
                recordIndex: -1,
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
                {text: 'NỘI DUNG', value: 'content', align: 'start'},
                {text: 'HÀNH ĐỘNG', value: 'more', align: 'end'}
            ],
            selectInquiryMain: [],
            selectedInquiryMain: [],
            assignToDoctorDialogMain: false,
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
            handleNotificationObj: 'handleNotificationObj',
            user: 'user'
        }),
    },
    watch: {
        newNotification(){
            this.handleNewNotification(this.newNotification)
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
        },
        selectedInquiryMain(){
            if(this.selectedInquiryMain.length == 0){
                this.selectableDoctor = []
                this.selectDoctorTitle = 'Chọn Bác sĩ'
                this.selectedDoctor = []
            }
            else {
                let type = this.selectedInquiryMain[0].type
                if(type == 0){
                    this.selectableDoctor = this.allSpecialist
                    this.selectDoctorTitle = 'Chọn Bác sĩ chuyên khoa'
                }
                else {
                    this.selectableDoctor = this.allDietitian
                    this.selectDoctorTitle = 'Chọn Bác sĩ dinh dưỡng'
                }
            }
        },
    },
    methods: {
        returnTimeFromTimeArray(arr){
            return func.returnTimeFromTimeArray(arr)
        },
        returnInquiryType(type){
            return (type == 0) ? 'Khám bệnh' : 'Dinh dưỡng'
        },
        returnGender(number){
            return func.returnGender(number)
        },
        returnRole(role){
            return func.returnRole(role)
        },
        scrollBottom() {
			window.scrollTo(0,document.body.scrollHeight)
        },
        setPatientStatusBit(index, value){
            if(value == true){
                switch(index){
                    //has spec or diet
                    case 2:
                    case 3: {
                        this.patientStatusBitAllValue[5] = 0;
                        this.patientStatusBitAllValue[6] = 0;
                        break;
                    }
                    case 4: {
                        this.patientStatusBitAllValue[6] = 0;
                        break;
                    }
                    // //only has prac
                    // case 5: {
                    //     this.patientStatusBitAllValue[2] = 0;
                    //     this.patientStatusBitAllValue[3] = 0;
                    //     this.patientStatusBitAllValue[6] = 0;
                    //     break;
                    // }
                    //all patient
                    case 6: {
                        this.patientStatusBitAllValue[2] = 0;
                        this.patientStatusBitAllValue[3] = 0;
                        this.patientStatusBitAllValue[4] = 0;
                        this.patientStatusBitAllValue[5] = 0;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        },
        returnValueFromStatusBit(){
            if(this.patientStatusBitAllValue[6] == true || !this.patientStatusBitAllValue.includes(true)){
                return -1;
            }
            else {
                let bitArr = []
                for(let i = 0; i < 5 ; i++){
                    bitArr[i] = (this.patientStatusBitAllValue[i] == true) ? 1 : 0
                }
                let statusValue = bitArr.reverse().join("")
                // console.log(statusValue)
                //has been reverse
                // console.log(bitArr)
                return convertNumber.convertToDecimal(statusValue) + 2;
            }
        },
        getAllPatients(page, size, searchObj){
            this.loadingPatient = true;
            this.allPatients = [];
            let params = {
                page: page,
                size: size,
            }
            searchObj.status = this.returnValueFromStatusBit()
            let searchString = '';
            //Loop through all property of patientSearch Obj
            for (const property in searchObj) {
                if(searchObj[property] != undefined && searchObj[property] != null && searchObj[property] != ''){
                    searchString += `${property}=${searchObj[property]},`
                }
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
        getPatientDetail(id, isDetail){
            // this.scrollBottom()
            this.detailInquiry = null;
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
        getPatientDetailAfterGetInquiry(id, isDetail){
            // this.scrollBottom()
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
        processPatientDetailFromServer(data, isDetail){
            this.patientDetail.dateOfBirth = data.dateOfBirth
            this.patientDetail.createdDate = data.createdDate
            this.patientDetail.email = data.email
            this.patientDetail.gender = this.returnGender(data.gender)
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
            if(isDetail == false){
                this.assignToDoctorDialog = true
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
            // this.scrollBottom()
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
        assignToPrac(patientId, inquiryArr, doctorArr){
            for(let i = 0; i < doctorArr.length; i++){
                this.assignToDoctor(patientId, inquiryArr[0].id, doctorArr[i])
            }
        },
        assignToDoctor(patientId, inquiryId, doctor){
            let body = {
                "doctor_id": doctor.id,
                "inquiry_id": inquiryId
            }
            let url = `${config.apiUrl}/patients/${patientId}/doctor`
            this.$toast.open({
                message: `Đang gán quyền quản lý bệnh nhân cho bác sĩ ${doctor.name}...`,
                type: 'info',
            })
            apiService.postApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: `Gán quyền quản lý bệnh nhân cho bác sĩ ${doctor.name} thành công!`,
                        type: 'success',
                    })
                    this.getDoctorInCharge(patientId)
                }
                else {
                    this.$toast.open({
                        message: (result.data.message == 'Bad request: Bác sĩ này đã được gán cho bệnh nhân này') ? `Bác sĩ ${doctor.name} đã quản lý bệnh nhân này` : result.data.message,
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
        getDoctorInCharge(patientId){
            let url = `${config.apiUrl}/patients/${patientId}/doctor`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    let data = result.data
                    this.patientDetail.specialists = data.specialists
                    this.patientDetail.dietitians = data.dietitians
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
        getAllSpec(){
            let params = {
                search: 'role=1,status=1',
                page: 1,
                size: 1000,
            }
            let url = `${config.apiUrl}/doctors`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.allSpecialist = result.data.content
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
        getAllDiet(){
            let params = {
                search: 'role=2,status=1',
                page: 1,
                size: 1000,
            }
            let url = `${config.apiUrl}/doctors`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.allDietitian = result.data.content
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
                note: note,
                type: 0
            }
            if(diag){
                body.diagnose = diag;
            }
            this.$store.dispatch('turnOnLoadingDialog', 'Đang duyệt tư vấn...')
            apiService.putApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Duyệt tư vấn thành công',
                        type: 'success',
                    })
                    if(isMedical == true){
                        this.detailInquiry.medicalRecords.splice(index, 1)
                        this.getNewRecordFromNotification(result.data.id, 0)
                    }
                    else {
                        this.detailInquiry.dietRecords[index].splice(index, 1)
                        this.getNewRecordFromNotification(result.data.id, 1)
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
                        message: 'Xóa khỏi quyền quản lý thành công',
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
        openAssignToDoctorMainDialog(item){
            this.selectInquiryMain.push(item)
            this.selectedInquiryMain.push(item)
            this.assignToDoctorDialogMain = true
        },
        getNewRecordFromNotification(recordId, typeRecord){
            let url = `${config.apiUrl}/records/${recordId}`
            let params = {
                type: typeRecord
            }
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    if(this.detailInquiry != null && this.detailInquiry.id == result.data.inquiry.id){
                        (result.data.inquiry.type == 0) ? (this.detailInquiry.medicalRecords.push(result.data)) : (this.detailInquiry.dietRecords.push(result.data))
                    }  
                }
            }).catch(error => {
                console.log(error)
            })
        },
        getInquiryFromRecordId(recordId, typeRecord){
            let url = `${config.apiUrl}/records/${recordId}`
            let params = {
                type: typeRecord
            }
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.detailInquiry = null;
                    let record = result.data
                    this.$store.dispatch('turnOnLoadingDialog', 'Đang lấy thông tin chi tiết yêu cầu tư vấn...')
                    let url = `${config.apiUrl}/inquiries/${record.inquiry.id}`
                    apiService.getApi(url).then(result => {
                        if(result.status.toString()[0] === "2"){
                            this.detailInquiry = result.data
                            //chi add tu van chua dc duyet (recordType = 0 va status = 0)
                            if((record.recordType + record.status) == 0){
                                this.detailInquiry.medicalRecords.push(record)
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
                }
            }).catch(error => {
                console.log(error)
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
        getAllRecordsOfInquiry(inquiryId){
            let url = `${config.apiUrl}/records/${inquiryId}`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    console.log(result)
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
        openNewScheduleDialog(patientId){
            this.$store.dispatch('setNewScheduleObj', patientId)
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
                        //specialist advise, dietitian advise 
                        case 1: {
                            this.getNewRecordFromNotification(payloadId, 0)
                            break;
                        }
                        //new reply
                        case 2: {
                            this.getRepliesFromNewNotification(payloadId)
                            break;
                        }
                        //dietitian advise 
                        case 11: {
                            this.getNewRecordFromNotification(payloadId, 1)
                            break;
                        }
                        //assigned new patient
                        case 3:  {
                            this.patientPage = 1;
                            this.patientSearch = {
                                name: undefined,
                                status: -1,
                                gender: undefined,
                                age: undefined
                            }
                            this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
                            this.inquiryPage = 1;
                            this.getInquiries(this.inquiryPage, this.inquiryPageSize, this.inquiryAssign)
                            break;
                        }
                        //patient send health indexes
                        // case 8: {
                        //     this.healthIndexesResult.page = 1;
                        //     this.healthIndexesResult.search = {
                        //         patient_id: undefined,
                        //         patient_name: undefined,
                        //         scheduleId: undefined,
                        //         index_id: undefined,
                        //         index_name: undefined
                        //     }
                        //     this.getHealthIndexesResult(this.healthIndexesResult.page,  this.healthIndexesResult.pageSize, this.healthIndexesResult.search)
                        //     break;
                        // }
                        //doctor accept, reject assign, remove patient, 
                        case 4:
                        case 5:
                        case 6: {
                            if(this.patientDetail.id == payloadId){
                                this.getDoctorInCharge(payloadId)
                            }
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
                                status: -1,
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
                    //handle and reset
                    //0: patient send new inquiry
                    //2: new reply
                    //3: assigned a new patient
                    //4, 5: doctor accept, reject assign
                    case 0:
                    case 2:
                    case 3:
                    case 4:
                    case 5: {
                        this.getDetailInquiry(payloadId)
                        this.$store.dispatch('resetHandleNotification')
                        break;
                    }
                    //new record
                    case 1: {
                        this.getInquiryFromRecordId(payloadId, 0)
                        this.$store.dispatch('resetHandleNotification')
                        break;
                    }
                    case 11: {
                        this.getInquiryFromRecordId(payloadId, 1)
                        this.$store.dispatch('resetHandleNotification')
                        break;
                    }
                    //doctor remove a patient
                    case 6: {
                        this.getPatientDetail(payloadId)
                        this.$store.dispatch('resetHandleNotification')
                        break
                    }
                    //patient has been deactivated
                    //do nothing, just reset
                    case 10: {
                        this.$store.dispatch('resetHandleNotification')
                        break;
                    }
                    //do nothing, let healthindexes.vue do the handling
                    case 8: {
                        // this.getDetailHealthIndexesResult(payloadId)
                        break;
                    }
                    // default: {
                    //     break;
                    // }
                }
            }
        },
        goToPage(link){
            this.$router.replace(link)
        },
    },
    created(){
        this.checkComeFromNotiPage()
        this.getInquiries(this.inquiryPage, this.inquiryPageSize, this.inquiryAssign)
        this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
        this.getAllSpec()
        this.getAllDiet()
    }
}
</script>
<style scoped>

</style>