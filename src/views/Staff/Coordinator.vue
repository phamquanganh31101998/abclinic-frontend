<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Chức năng dành cho Điều phối viên</h1>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col cols="12" xs="12" sm="12" md="8" lg="4" xl="4">
                <!-- <h2>
                    Danh sách nhân viên 
                    <v-icon v-show="showDoctor == false" @click="showDoctor = true">keyboard_arrow_down</v-icon>
                    <v-icon v-show="showDoctor == true" @click="showDoctor = false">keyboard_arrow_up</v-icon>
                </h2>
                 -->
                
            </v-col>
            <v-col cols="12" v-show="showDoctor" xs="12" sm="12" md="12" lg="12" xl="12">
                <v-data-table :headers="doctorHeaders" :items="allDoctors" class="elevation-4" hide-default-footer loading-text="Đang lấy dữ liệu..." no-data-text="Không có kết quả phù hợp" :loading="loadingDoctor">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title><h3>Danh sách nhân viên</h3></v-toolbar-title>
                            <v-divider
                                class="mx-4"
                                inset
                                vertical
                            ></v-divider>
                            <v-spacer></v-spacer>
                            <v-menu
                                v-model="doctorSearchMenu"
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
                                        <h4>Tìm kiếm nhân viên</h4>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-text-field clearable v-model="doctorSearch.name" label="Tên"></v-text-field>
                                        <v-select clearable v-model="doctorSearch.role" :items="doctorRoles" label="Chức vụ"></v-select>
                                        <v-select clearable v-model="doctorSearch.specialty" :items="[]" label="Chuyên môn"></v-select>
                                        <v-text-field clearable v-model="doctorSearch.experience" label="Kinh nghiệm (năm)" type="number"></v-text-field>
                                        <v-select v-model="doctorSearch.status" :items="doctorStatus" label="Trạng thái"></v-select>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="red" @click="doctorSearchMenu = false">Đóng</v-btn>
                                        <v-btn color="primary" text @click="doctorSearchMenu =  false, doctorPage = 1, getAllDoctor(doctorPage, doctorPageSize, doctorSearch)">Tìm kiếm</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>
                            <!-- <v-select
                                class="mt-2"
                                v-show="showDoctor"
                                :items="doctorRoles"
                                v-model="doctorType"
                            ></v-select> -->
                        </v-toolbar>
                    </template>
                    <template v-slot:item.more="{ item }">
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">more_vert</v-icon>
                            </template>
                            <v-list>
                                <v-list-item
                                    @click="getDoctorDetail(item.id)"
                                    >
                                    <v-list-item-title>Xem chi tiết</v-list-item-title>
                                </v-list-item>
                                <v-dialog
                                    persistent
                                    v-model="deleteDoctorDialog"
                                    width="400"
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
                                            <span style="color: white">Xác nhận xóa nhân viên</span>
                                        </v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-text>
                                            <br>
                                            Bạn có chắc chắn muốn xóa? 
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
                        @input="getAllDoctor(doctorPage, doctorPageSize, doctorSearch)"
                    ></v-pagination>
                </div>
                <v-dialog v-model="doctorDetailDialog" max-width="700px">
                    <v-card>
                        <v-card-title
                            class="headline primary"
                            primary-title
                            >
                            <span style="color: white">Chi tiết nhân viên</span>
                        </v-card-title>
                        <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field readonly label="Tên" :value="doctorDetail.name"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field readonly label="Ngày sinh" :value="doctorDetail.dateOfBirth" ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        readonly 
                                        label="Giới tính"
                                        :value="checkGender(doctorDetail.gender)"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                    <v-text-field readonly label="Email" :value="doctorDetail.email"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                    <v-text-field readonly label="Email" :value="doctorDetail.phoneNumber"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field readonly label="Ghi chú" :value="doctorDetail.description"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field readonly label="Chuyên môn" :value="doctorDetail.specialty"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red" text @click="doctorDetailDialog = false">Đóng</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col xs="12" md="12" sm="12" lg="12" xl="12">
                <!-- <h2>
                    Danh sách bệnh nhân chưa có bác sĩ quản lý
                    <v-icon v-show="showPatient == false" @click="showPatient = true">keyboard_arrow_down</v-icon>
                    <v-icon v-show="showPatient == true" @click="showPatient = false">keyboard_arrow_up</v-icon>
                </h2> -->
                <v-data-table v-show="showPatient" :headers="patientHeaders" 
                no-data-text="Không có kết quả phù hợp" loading-text="Đang lấy dữ liệu" :loading="loadingPatient"
                :items="allPatients" class="elevation-4" hide-default-footer>
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title><h3>Danh sách bệnh nhân</h3></v-toolbar-title>
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
                                        <v-select v-model="patientSearch.status" :items="patientStatus" label="Trạng thái"></v-select>
                                        <v-select v-model="patientSearch.gender" :items="genderArr" label="Giới tính"></v-select>
                                        <v-text-field clearable type="number" v-model="patientSearch.age" label="Tuổi"></v-text-field>
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
                        @input="this.getAllPatients(this.patientPage, this.patientPageSize)"
                    ></v-pagination>
                </div>
                <v-dialog scrollable v-model="patientDetailDialog" max-width="700px" persistent>
                    <v-card>
                        <v-card-title
                            class="headline primary"
                            primary-title
                            >
                            <span style="color: white">Chi tiết bệnh nhân</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="4">
                                        <v-text-field readonly label="Tên" v-model="patientDetail.name"></v-text-field>
                                    </v-col>
                                    
                                    <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="4">
                                        <v-text-field readonly label="Ngày sinh" v-model="patientDetail.dateOfBirth"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="4">
                                        <v-text-field readonly label="Giới tính" v-model="patientDetail.gender"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                                        <v-text-field readonly label="Email" v-model="patientDetail.email"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                                        <v-text-field readonly label="Số điện thoại" v-model="patientDetail.phoneNumber"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
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
                                    
                                </v-row>
                            </v-container>

                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
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
                            <v-btn color="blue" text :disabled="selectedInquiry.length == 0 || selectedDoctor.length == 0" @click="assignToPrac(patientDetail.id, selectedInquiry, selectedDoctor), assignToPracDialog = false">GÁN</v-btn>
                            <v-btn color="red" text @click="assignToPracDialog = false">QUAY LẠI</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                <br>
                <v-data-table v-show="showSpec" class="elevation-4" :headers="specHeaders" :items="specialties" hide-default-footer no-data-text="Hiện tại chưa có chuyên môn nào" loading-text="Đang lấy dữ liệu..." :loading="loadingSpec">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title><h3>Danh sách chuyên môn</h3></v-toolbar-title>
                            <v-divider
                                class="mx-4"
                                inset
                                vertical
                            ></v-divider>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="createSpec.dialog" persistent width="400" max-width="70%">
                                <template v-slot:activator="{ on }">
                                    <v-btn v-show="showSpec" color="primary" dark v-on="on"> <v-icon>add</v-icon> Tạo chuyên môn</v-btn>
                                </template>
                                <v-card>
                                    <v-card-title
                                        class="headline primary"
                                        primary-title
                                        >
                                        <span style="color: white">Tạo chuyên môn mới</span>
                                    </v-card-title>
                                    <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-text-field v-model="createSpec.name" label="Tên chuyên môn"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-textarea rows="3" v-model="createSpec.detail" label="Mô tả chuyên môn"></v-textarea>
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
                        </v-toolbar>
                    </template>
                    <template v-slot:item.more="{ item }">
                        <a @click="openSpecDetailDialog(item.id)">{{item.more}} <v-icon>create</v-icon>   </a>
                    </template>
                </v-data-table>
                <v-dialog offset-y persistent v-model="specDetailDialog" width="400" max-width="70%">
                    <v-card>
                        <v-card-title
                            class="headline primary"
                            primary-title
                            >
                            <span style="color: white">Chỉnh sửa chuyên môn</span>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="specDetail.name" label="Tên chuyên môn"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-textarea rows="3" v-model="specDetail.detail" label="Mô tả chuyên môn"></v-textarea>
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
            <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                <br>
                <v-data-table class="elevation-4" :headers="diseaseHeaders" :items="allDisease" hide-default-footer no-data-text="Hiện tại chưa có bệnh nào" loading-text="Đang lấy dữ liệu..." :loading="loadingDisease">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title><h3>Danh sách các căn bệnh</h3></v-toolbar-title>
                            <v-divider
                                class="mx-4"
                                inset
                                vertical
                            ></v-divider>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="createDisease.dialog" persistent width="400" max-width="70%">
                                <template v-slot:activator="{ on }">
                                    <v-btn color="primary" dark v-on="on"> <v-icon>add</v-icon> Tạo căn bệnh mới</v-btn>
                                </template>
                                <v-card>
                                    <v-card-title
                                        class="headline primary"
                                        primary-title
                                        >
                                        <span style="color: white">Tạo căn bệnh mới</span>
                                    </v-card-title>
                                    <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-text-field v-model="createDisease.name" label="Tên căn bệnh"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-textarea rows="3" v-model="createDisease.description" label="Mô tả căn bệnh"></v-textarea>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" :disabled="createDisease.name == '' || createDisease.description == ''" text @click="createNewDisease(createDisease.name, createDisease.description), createDisease.dialog = false">TẠO</v-btn>
                                    <v-btn color="red" text @click="createDisease.dialog = false">ĐÓNG</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.more="{ item }">
                        <a @click="openDiseaseDetailDialog(item.id)">{{item.more}} <v-icon>create</v-icon>   </a>
                    </template>
                </v-data-table>
                <v-dialog offset-y persistent v-model="diseaseDetailDialog" width="400" max-width="70%">
                    <v-card>
                        <v-card-title
                            class="headline primary"
                            primary-title
                            >
                            <span style="color: white">Chỉnh sửa căn bệnh</span>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="diseaseDetail.name" label="Tên căn bệnh"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-textarea rows="3" v-model="diseaseDetail.description" label="Mô tả căn bệnh"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" :disabled="diseaseDetail.name == '' || diseaseDetail.description == ''" text @click="diseaseDetailDialog = false, updateDisease(diseaseDetail.name, diseaseDetail.description, diseaseDetail.id)">SỬA</v-btn>
                        <v-btn color="red" text @click="diseaseDetailDialog = false">ĐÓNG</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                <v-dialog scrollable v-model="registerObj.dialog" max-width="700px" persistent>
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark v-on="on">Đăng ký tài khoản</v-btn>
                    </template>
                    <v-card>
                        <v-card-title
                            class="headline grey lighten-2"
                            primary-title
                            >
                            Tạo tài khoản
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
// const { encode } = require('url-encode-decode')
import apiService from '../../services/api.service'
import config from '../../config'
export default {
    data(){
        return {
            doctorPages: 0,
            doctorPage: 1,
            doctorPageSize: 10,
            doctorRoles: [
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
            doctorSearch: {
                name: undefined,
                role: undefined,
                specialty: undefined,
                experience: undefined,
                status: 1,
            },
            doctorStatus: [
                {
                    text: 'Hoạt động',
                    value: 1
                },
                {
                    text: 'Ngừng hoạt động',
                    value: 1024
                },
            ],
            doctorSearchMenu: false,
            responseText: 'Try something',
            showDoctor: true,
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
                specialty: '',
                phoneNumber: 0
            },
            allDoctors: [],
            doctorHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'EMAIL', value: 'email', align: 'start' },
                { text: 'GIỚI TÍNH', value: 'gender', align: 'start' },
                { text: 'CHỌN HÀNH ĐỘNG', value: 'more', align: 'right' },
            ],
            loadingDoctor: false,
            specialties: [],
            specDetail: {},
            specDetailDialog: false,
            specHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'MÔ TẢ', value: 'detail', align: 'start' },
                { text: 'CHỈNH SỬA', value: 'more', align: 'right' },
            ],
            createSpec: {
                dialog: false,
                name: '',
                detail: ''
            },
            showSpec: true,
            deleteDoctorDialog: false,
            loadingSpec: false,
            allPatients: [],
            patientHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'TUỔI', value: 'age', align: 'start' },
                { text: 'CHỌN HÀNH ĐỘNG', value: 'more', align: 'end' },
            ],
            patientPage: 1,
            patientPageSize: 10,
            patientPages: 1,
            showPatient: true,
            patientDetailDialog: false,
            patientDetail: {
                dateOfBirth: '',
                createdDate: '',
                email: '',
                gender: '',
                id: '',
                inquiries: [
                    {
                        "id": 3,
                        "patient": 
                            {
                                "id": 16,
                                "role": "PATIENT",
                                "name": "Trần Tuấn Thành",
                                "age": 22
                            },
                        "content": "Batman bị chán ăn"
                    }
                ],
                name: '',
                phoneNumber: '',
                practitioner: '',
            },
            inquiryHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN BỆNH NHÂN', value: 'patient', align: 'start' },
                { text: 'KIỂU YÊU CẦU', value: 'type', align: 'start' },
                { text: '', value: 'data-table-expand' },
            ],
            assignToPracDialog: false,
            loadingPatient: false,
            patientSearch: {
                name: undefined,
                status: undefined,
                gender: undefined,
                age: undefined
            },
            patientSearchMenu: false,
            patientStatus: [
                {
                    text: 'Tất cả bệnh nhân',
                    value: -1
                },
                {
                    text: 'Bệnh nhân chưa có bác sĩ quản lý',
                    value: 1
                }
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
            allDisease: [],
            diseaseDetail: {},
            diseaseDetailDialog: false,
            diseaseHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'MÔ TẢ', value: 'description', align: 'start' },
                { text: 'CHỈNH SỬA', value: 'more', align: 'right' },
            ],
            createDisease: {
                dialog: false,
                name: '',
                description: ''
            },
            loadingDisease: false,
            diseasePage: 1,
            diseasePages: 0,
            diseasePageSize: 10,
        }
    },
    watch: {
        // doctorType(){
        //     this.getAllDoctor(this.doctorPage, this.doctorPageSize, this.doctorType)
        // },
        // doctorPage(){
        //     this.getAllDoctor(this.doctorPage, this.doctorPageSize, this.doctorType)
        // },
        // patientPage(){
        //     this.getAllPatients(this.patientPage, this.patientPageSize)
        // }
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
        getAllDoctor(page, size, searchObj){
            this.loadingDoctor = true;
            this.allDoctors = []
            let params = {
                page: page,
                size: size,
            }
            let searchString = '';
            //Loop through all property of DoctorSearch Obj
            for (const property in searchObj) {
                if(searchObj[property] != undefined && searchObj[property] != null && searchObj[property] != ''){
                    searchString += `${property}=${searchObj[property]},`
                }
                if(searchObj[property] == 0){
                    searchString += `${property}=${searchObj[property]},`
                }
            }
            params.search = searchString
            let url = `${config.apiUrl}/doctors`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.doctorPages = result.data.totalPages
                    this.updateDoctorsArrayFromServer(result.data.content)
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                    
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.loadingDoctor = false;
            })
        },
        updateDoctorsArrayFromServer(doctorArray){
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
        getDoctorDetail(id){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang lấy thông tin chi tiết nhân viên...')
            let url = `${config.apiUrl}/doctors/${id}`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.doctorDetail = Object.assign({}, result.data)
                    this.doctorDetailDialog = true
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
        deleteDoctor(id){
            let url = `${config.apiUrl}/doctors`
            let params = {
                id: id
            }
            apiService.deleteApi(url, params).then(result => {
                console.log(result)
                this.getAllDoctor(1, 10)
            }).catch(error => {
                console.log(error)
            })
            this.deleteDoctorDialog = false
        },
        getSpecialties(){
            this.loadingSpec = true;
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
            }).finally(() => {
                this.loadingSpec = false;
            })
        },
        updateSpecialtiesFromServer(specArray){
            this.specialties = specArray;
        },
        createSpecialty(name, detail){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang tạo chuyên môn mới...')
            let url = `${config.apiUrl}/specialties`
            let params = {
                name: name,
                detail: detail
            }
            apiService.postApiParams(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Tạo chuyên môn thành công'})
                    this.createSpec.name = '';
                    this.createSpec.detail = '';
                    this.getSpecialties()
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
        openSpecDetailDialog(id){
            let index = this.findObjIndexById(this.specialties, id);
            this.specDetail = Object.assign({}, this.specialties[index])
            this.specDetailDialog = true;
        },
        updateSpec(name, detail, id){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang cập nhật thông tin chuyên môn...')
            let url = `${config.apiUrl}/specialties`
            let params = {
                name: name,
                detail: detail,
                id: id
            }
            apiService.putApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Sửa chuyên môn thành công'})
                    this.getSpecialties()
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
            // this.specDetailDialog = false;
        },
        getAllDisease(page, size){
            this.loadingDisease = true;
            let params = {
                page: page,
                size: size
            }
            let url = `${config.apiUrl}/disease`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.diseasePages = result.data.totalPages
                    this.updateAllDiseaseFromServer(result.data.content)
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.loadingDisease = false;
            })
        },
        updateAllDiseaseFromServer(diseaseArray){
            this.allDisease = diseaseArray;
        },
        createNewDisease(name, description){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang tạo căn bệnh mới...')
            let url = `${config.apiUrl}/disease`
            let params = {
                name: name,
                description: description
            }
            apiService.postApiParams(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Tạo căn bệnh thành công'})
                    this.createDisease.name = '';
                    this.createDisease.description = '';
                    this.getAllDisease(this.diseasePage, this.diseasePageSize)
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
        openDiseaseDetailDialog(id){
            let index = this.findObjIndexById(this.allDisease, id);
            this.diseaseDetail = Object.assign({}, this.allDisease[index])
            this.diseaseDetailDialog = true;
        },
        updateDisease(name, description, id){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang cập nhật căn bệnh...')
            let url = `${config.apiUrl}/disease/${id}`
            let params = {
                name: name,
                description: description,
                id: id
            }
            apiService.putApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Sửa căn bệnh thành công'})
                    this.getAllDisease(this.diseasePage, this.diseasePageSize)
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.$store.dispatch('turnOffLoadingDialog')
            })
            // this.specDetailDialog = false;
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
                if(searchObj[property] == 0){
                    searchString += `${property}=${searchObj[property]},`
                }
            }
            params.search = searchString
            console.log(searchString)
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
                console.log(result)
                if(result.status.toString()[0] === "2"){
                    this.processPatientDetailFromServer(result.data, isDetail)
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
        processPatientDetailFromServer(data, isDetail){
            this.patientDetail.dateOfBirth = data.dateOfBirth
            this.patientDetail.createdDate = data.createdDate
            this.patientDetail.email = data.email
            this.patientDetail.gender = this.checkGender(data.gender)
            this.patientDetail.id = data.id
            this.patientDetail.inquiries = data.inquiries
            this.patientDetail.name = data.name
            this.patientDetail.phoneNumber = data.phoneNumber
            if(isDetail == true){
                this.patientDetailDialog = true
            }
            else {
                this.assignToPracDialog = true
            }
        },
        assignToPrac(patientId, inquiry, doctor){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang gán bệnh nhân cho bác sĩ...')
            let url = `${config.apiUrl}/patients/${patientId}/doctor`
            let params = {
                "doctor-id": doctor[0].id,
                id: patientId,
                "inquiry-id": inquiry[0].id
            }
            apiService.postApiParams(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Gán quyền quản lý bệnh nhân thành công!'})
                    this.getAllPatients(1, 10)
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
        register(name, email, phone, dob, gender, role, password){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang đăng ký tài khoản mới...')
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
                if(result.status.toString()[0] === "2"){
                    this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Tạo tài khoản thành công'})
                    if(role == 4){
                        this.getAllPatients(1, 10)
                    }
                    else {
                        this.doctorPage = 1;
                        this.doctorSearch = {
                            name: undefined,
                            role: undefined,
                            specialty: undefined,
                            experience: undefined,
                            status: 1,
                        }
                        this.getAllDoctor(this.doctorPage, this.doctorPageSize, this.doctorSearch)
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
        getAllPractitioner(){
            let params = {
                page: 1,
                size: 1000,
                search: 'role=0'
            }
            let url = `${config.apiUrl}/doctors`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.allPractitioner = result.data.content
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
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
    },
    created(){
        // console.log(encode(decode('https://fathomless-savannah-38522.herokuapp.com/api/doctors?page=1&search=role%3D0%2Cstatus%3D1%2Cname%3DT%C3%B9ng&size=4')))
        this.registerObj.dateOfBirth = new Date().toISOString().substr(0, 10)
        // this.getSpecialties()
        // this.getAllDoctor(this.doctorPage, this.doctorPageSize, this.doctorSearch)
        // this.getAllPatients(this.patientPage, this.patientPageSize, this.patientSearch)
        this.getAllDisease(this.diseasePage, this.diseasePageSize)
        this.getAllPractitioner()
    }
}
</script>
<style scoped>

</style>