<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Thông tin phòng khám</h1>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <v-card height="100%" class="elevation-4">
                    <v-data-table :headers="doctorHeaders" :items="allDoctors" class="elevation-0" hide-default-footer loading-text="Đang lấy dữ liệu..." no-data-text="Không có kết quả phù hợp" :loading="loadingDoctor">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title><h3>Nhân viên phòng khám</h3></v-toolbar-title>
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
                                        text
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
                                            <v-text-field clearable v-model="doctorSearch.specialty" label="Tên chuyên môn"></v-text-field>
                                            <v-text-field clearable v-model="doctorSearch.experience" label="Kinh nghiệm (năm)" type="number"></v-text-field>
                                            <v-select v-model="doctorSearch.status" :items="doctorStatus" label="Trạng thái"></v-select>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" text @click="doctorSearchMenu =  false, doctorPage = 1, getAllDoctor(doctorPage, doctorPageSize, doctorSearch)">Tìm kiếm</v-btn>
                                            <v-btn text color="red" @click="doctorSearchMenu = false">Đóng</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-menu>
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
                                        <v-list-item-title>Chỉnh sửa thông tin</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item v-if="doctorSearch.status == 1" @click="deleteUserId = item.id, deleteUserTypeIsStaff = true, deleteUserDialog = true"><v-list-item-title>Hủy kích hoạt tài khoản</v-list-item-title></v-list-item>
                                    <v-list-item v-if="doctorSearch.status == 1024" @click="reactivateUser(item.id, true)"><v-list-item-title>Kích hoạt lại tài khoản</v-list-item-title></v-list-item>
                                </v-list>
                            </v-menu>
                        </template>
                        <template v-slot:item.role="{ item }">
                            {{returnRole(item.role)}}
                        </template>
                        <template v-slot:item.status="{item}">
                            <span v-if="item.status != 1024">Đang hoạt động</span>
                            <span v-if="item.status == 1024" style="color: red">Đã ngừng hoạt động</span>
                        </template>
                        <template v-slot:footer>
                            <br>
                            <div class="text-center">
                                <v-pagination
                                    :total-visible="7"
                                    v-model="doctorPage"
                                    :length="doctorPages"
                                    @input="getAllDoctor(doctorPage, doctorPageSize, doctorSearch)"
                                ></v-pagination>
                            </div>
                            <br>
                            <v-dialog scrollable v-model="registerObj.dialog" max-width="700px" persistent>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-show="user != null && user.role == 'COORDINATOR'" color="primary" text dark v-on="on"><v-icon>add</v-icon>  Tạo tài khoản nhân viên</v-btn>
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
                                        <v-btn color="blue darken-1" :disabled="!registerObj.valid" text @click="registerObj.dialog = false, register(registerObj.name, registerObj.email, registerObj.phoneNumber, registerObj.dateOfBirth, registerObj.gender, registerObj.role, registerObj.password)">Tạo</v-btn>
                                        <v-btn color="red" text @click="registerObj.dialog = false">ĐÓNG</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </template>
                    </v-data-table>
                    
                </v-card>
                <v-dialog v-model="doctorDetailDialog" max-width="700px">
                    <v-card>
                        <v-card-title
                            class="headline primary"
                            primary-title
                            >
                            <span style="color: white">Thông tin chi tiết nhân viên</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form v-model="doctorDetailValid">
                                <v-row>
                                    <v-col cols="12" sm="12" md="6">
                                        <v-text-field :rules="noEmptyRules" label="Tên" v-model="doctorDetail.name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6">
                                        <v-menu
                                            ref="dobMenu"
                                            v-model="dobMenu"
                                            :close-on-content-click="false"
                                            :return-value.sync="doctorDetail.dateOfBirth"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="290px"
                                            >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-on="on" label="Ngày sinh" v-model="doctorDetail.dateOfBirth" readonly ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="doctorDetail.dateOfBirth" @input="$refs.dobMenu.save(doctorDetail.dateOfBirth), dobMenu = false" scrollable></v-date-picker>
                                        </v-menu>
                                        
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6">
                                        <v-select
                                            v-model="doctorDetail.gender"
                                            :items="genderArr"
                                            label="Giới tính"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                        <v-text-field :rules="emailRules" label="Email" v-model="doctorDetail.email"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                        <v-text-field :rules="phoneRules" type="number" label="Số điện thoại" v-model="doctorDetail.phoneNumber"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6">
                                        <v-text-field label="Ghi chú" v-model="doctorDetail.description"></v-text-field>
                                    </v-col>
                                    <!-- <v-col cols="12">
                                        <v-text-field readonly label="Chuyên môn" v-model="doctorDetail.specialty"></v-text-field>
                                    </v-col> -->
                                </v-row>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" text :disabled="!doctorDetailValid" @click="updateDoctorInfo(doctorDetail), doctorDetailDialog = false">Chỉnh sửa</v-btn>
                            <v-btn color="red" text @click="doctorDetailDialog = false">Đóng</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row wrap row>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <v-card height="100%" class="elevation-4">
                    <v-data-table class="elevation-0" :headers="diseaseHeaders" :items="allDisease" hide-default-footer no-data-text="Hiện tại chưa có bệnh nào" loading-text="Đang lấy dữ liệu..." :loading="loadingDisease">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title><h3>Các căn bệnh</h3></v-toolbar-title>
                                <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                ></v-divider>
                                
                                <v-spacer></v-spacer>
                                <v-menu
                                    v-model="diseaseSearchMenu"
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
                                            <h4>Tìm kiếm căn bệnh</h4>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-text-field clearable v-model="diseaseSearch.name" label="Tên"></v-text-field>
                                            <v-text-field clearable v-model="diseaseSearch.description" label="Mô tả"></v-text-field>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" text @click="diseaseSearchMenu =  false, diseasePage = 1, getAllDisease(diseasePage, diseasePageSize, diseaseSearch)">Tìm kiếm</v-btn>
                                            <v-btn text color="red" @click="diseaseSearchMenu = false">Đóng</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-menu>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.more="{ item }">
                            <a @click="openDiseaseDetailDialog(item.id)">{{item.more}} <v-icon>create</v-icon>   </a>
                        </template>
                        <template v-slot:footer>
                            <br>
                            <div class="text-center">
                                <v-pagination
                                    :total-visible="7"
                                    v-model="diseasePage"
                                    :length="diseasePages"
                                    @input="getAllDisease(diseasePage, diseasePageSize)"
                                ></v-pagination>
                            </div>
                            <v-dialog v-model="createDisease.dialog" persistent width="400" max-width="70%">
                                <template v-slot:activator="{ on }">
                                    <v-btn v-show="user != null && user.role == 'COORDINATOR'" color="primary" text dark v-on="on"> <v-icon>add</v-icon> Tạo căn bệnh mới</v-btn>
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
                            <br>
                            
                        </template>
                    </v-data-table>
                    
                </v-card>
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
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <v-card class="elevation-4" height="100%">
                    <v-data-table class="elevation-0" :headers="healthIndexesHeaders" :items="healthIndexes" hide-default-footer no-data-text="Hiện tại chưa có chỉ số nào" loading-text="Đang lấy dữ liệu..." :loading="loadingHealthIndexes">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title><h3>Mẫu kiểm tra chỉ số sức khỏe</h3></v-toolbar-title>
                                <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                ></v-divider>
                                <v-spacer></v-spacer>
                                
                            </v-toolbar>
                        </template>
                        <template v-slot:item.more="{ item }">
                            <a @click="detailHealthIndexes = Object.assign({}, item), detailHealthIndexesDialog = true"><v-icon>create</v-icon></a>
                        </template>
                        <template v-slot:item.fields="{ item }">
                            <span v-for="field in item.fields" :key="field.id">{{field.name}}, </span>
                        </template>
                        <template v-slot:footer>
                            <br>
                            <div class="text-center">
                                <v-pagination
                                    :total-visible="7"
                                    v-model="healthIndexesPage"
                                    :length="healthIndexesPages"
                                    @input="getHealthIndexes(healthIndexesPage, healthIndexesPageSize)"
                                ></v-pagination>
                            </div>
                            <v-dialog v-model="createHealthIndexesDialog" persistent width="400" max-width="70%">
                                <template v-slot:activator="{ on }">
                                    <v-btn v-show="user != null && user.role == 'COORDINATOR'" text color="primary" dark v-on="on"> <v-icon>add</v-icon> Tạo mẫu mới</v-btn>
                                </template>
                                <v-card>
                                    <v-card-title
                                        class="headline primary"
                                        primary-title
                                        >
                                        <span style="color: white">Tạo mẫu kiểm tra chỉ số sức khỏe</span>
                                    </v-card-title>
                                    <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-text-field v-model="createHealthIndexesObj.name" label="Tên mẫu"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-textarea rows="3" v-model="createHealthIndexesObj.description" label="Mô tả"></v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                                <h4>Danh sách các chỉ số bệnh nhân cần gửi</h4>
                                                <div v-for="(field, index) in createHealthIndexesObj.fields" :key="field" style="position: relative; margin: 10px; padding: 10px; border: 1px solid grey; border-radius: 10px;">
                                                    <span>{{field}} </span>
                                                    <v-icon style="position: absolute; right: 0; color: red" @click="createHealthIndexesObj.fields.splice(index, 1)">clear</v-icon>
                                                </div>
                                                <br>
                                                <v-text-field label="Nhập tên chỉ số mới rồi nhấn Enter" v-model="healthIndexesNewField" @keyup.enter="createHealthIndexesObj.fields.push(healthIndexesNewField), healthIndexesNewField = ''"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text :disabled="createHealthIndexesObj.name == '' || createHealthIndexesObj.description == ''" @click="createHealthIndexes(createHealthIndexesObj.name, createHealthIndexesObj.description, createHealthIndexesObj.fields), createHealthIndexesDialog = false">TẠO MỚI</v-btn>
                                        <v-btn color="red" text @click="createHealthIndexesDialog = false">ĐÓNG</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </template>
                    </v-data-table>
                    
                </v-card>
                <v-dialog offset-y persistent v-model="detailHealthIndexesDialog" width="400" max-width="70%">
                    <v-card v-if="detailHealthIndexes != null">
                        <v-card-title
                            class="headline primary"
                            primary-title
                            >
                            <span style="color: white">Chỉnh sửa chỉ số sức khỏe</span>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="detailHealthIndexes.name" label="Tên chỉ số"></v-text-field>
                                    <v-textarea rows="3" v-model="detailHealthIndexes.description" label="Mô tả"></v-textarea>
                                    <v-btn color="primary" :disabled="detailHealthIndexes.name == '' || detailHealthIndexes.description == ''" @click="updateHealthIndexes(detailHealthIndexes.id, detailHealthIndexes.name, detailHealthIndexes.description)">Cập nhật thông tin cơ bản</v-btn>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                    <h4>Danh sách các trường</h4>
                                    <div v-for="(field) in detailHealthIndexes.fields" :key="field.id" style="position: relative; margin: 10px; padding: 10px; border: 1px solid grey; border-radius: 10px;">
                                        <span>{{field.name}} </span>
                                        <v-icon style="position: absolute; right: 0; color: red" @click="deleteField(detailHealthIndexes.id, field.id)">clear</v-icon>
                                    </div>
                                    <br>
                                    <v-text-field label="Nhập tên trường mới rồi nhấn Enter" v-model="healthIndexesNewField" @keyup.enter="addField(detailHealthIndexes.id, healthIndexesNewField)"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <!-- <v-btn color="blue darken-1" text @click="detailHealthIndexesDialog = false">CHỈNH SỬA</v-btn> -->
                        <v-btn color="red" text @click="getHealthIndexes(healthIndexesPage, healthIndexesPageSize), detailHealthIndexesDialog = false">ĐÓNG</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <v-card height="100%" class="elevation-4">
                    <v-data-table hide-default-footer class="elevation-0" :headers="specHeaders" :items="specialties" no-data-text="Hiện tại chưa có chuyên môn nào" loading-text="Đang lấy dữ liệu..." :loading="loadingSpec">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title><h3>Các chuyên môn</h3></v-toolbar-title>
                                <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                ></v-divider>
                                <v-spacer></v-spacer>
                                
                            </v-toolbar>
                        </template>
                        <template v-slot:item.more="{ item }">
                            <a @click="openSpecDetailDialog(item.id)">{{item.more}} <v-icon>create</v-icon>   </a>
                        </template>
                        <template v-slot:footer>
                            <br>
                            <v-dialog v-model="createSpec.dialog" persistent width="400" max-width="70%">
                                <template v-slot:activator="{ on }">
                                    <v-btn  text v-show="user != null && user.role == 'COORDINATOR'" color="primary" dark v-on="on"> <v-icon>add</v-icon> Tạo chuyên môn</v-btn>
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
                            <br>
                        </template>
                    </v-data-table>
                </v-card>
                
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
import {mapGetters} from 'vuex'
import apiService from '../../services/api.service'
import config from '../../config'
export default {
    data(){
        return {
            dobMenu: false,
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
            allDoctors: [],
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
            doctorDetailValid: true,
            doctorHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'CHỨC VỤ', value: 'role', align: 'start' },
                { text: 'NGÀY SINH', value: 'dateOfBirth', align: 'start'},
                { text: 'TUỔI', value: 'age', align: 'start' },
                { text: 'EMAIL', value: 'email', align: 'start' },
                { text: 'SỐ ĐT', value: 'phoneNumber', align: 'start' },
                { text: 'TRẠNG THÁI', value: 'status', align: 'start' },
                { text: 'CHỌN HÀNH ĐỘNG', value: 'more', align: 'end' },
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
            loadingSpec: false,
            deleteUserDialog: false,
            deleteUserId: 0,
            deleteUserTypeIsStaff: null,
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
            diseasePageSize: 5,
            diseaseSearchMenu: false,
            diseaseSearch: {
                name: undefined,
                description: undefined
            },
            healthIndexes: [],
            healthIndexesHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TÊN', value: 'name', align: 'start' },
                { text: 'MÔ TẢ', value: 'description', align: 'start' },
                { text: 'CÁC CHỈ SỐ', value: 'fields', align: 'start' },
                { text: 'CHỈNH SỬA', value: 'more', align: 'right' },
            ],
            loadingHealthIndexes: false,
            detailHealthIndexes: null,
            detailHealthIndexesDialog: false,
            createHealthIndexesObj: {
                name: '',
                description: '',
                fields: []
            },
            healthIndexesNewField: '',
            createHealthIndexesDialog: false,
            healthIndexesPage: 1,
            healthIndexesPages: 0,
            healthIndexesPageSize: 5,
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
                role: 0,
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
                ],
            },
        }
    },
    computed: {
        ...mapGetters({
            user: 'user'
        })
    },
    watch: {
        user(){
            
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
        findObjIndexById(arr, id){
            let result = -1;
            for(let i = 0; i < arr.length; i++){
                if(arr[i].id == id){
                    result = i
                }
            }
            return result
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
            if(searchString != ''){
                params.search = searchString
            }
            let url = `${config.apiUrl}/doctors`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.doctorPages = result.data.totalPages
                    this.updateDoctorsArrayFromServer(result.data.content)
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
                    gender: this.returnGender(this.checkString(doctorArray[i].gender)),
                    more: 'Xem chi tiết',
                    phoneNumber: this.checkString(doctorArray[i].phoneNumber),
                    role: this.checkString(doctorArray[i].role),
                    age: this.checkString(doctorArray[i].age),
                    dateOfBirth: this.checkString(doctorArray[i].dateOfBirth),
                    description: this.checkString(doctorArray[i].description),
                    specialty: this.checkString(doctorArray[i].specialty),
                    status: this.checkString(doctorArray[i].status)
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
                    this.doctorDetail.dateOfBirth = result.data.dateOfBirth.split("/").reverse().join("-")
                    this.doctorDetailDialog = true
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
        getSpecialties(){
            this.loadingSpec = true;
            let url = `${config.apiUrl}/specialties`
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.updateSpecialtiesFromServer(result.data)
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
                this.loadingSpec = false;
            })
        },
        updateSpecialtiesFromServer(specArray){
            this.specialties = specArray;
        },
        createSpecialty(name, detail){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang tạo chuyên môn mới...')
            let url = `${config.apiUrl}/specialties`
            let body = {
                name: name,
                detail: detail
            }
            apiService.postApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Tạo chuyên môn thành công',
                        type: 'success',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Tạo chuyên môn thành công'})
                    this.createSpec.name = '';
                    this.createSpec.detail = '';
                    this.getSpecialties()
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
        openSpecDetailDialog(id){
            let index = this.findObjIndexById(this.specialties, id);
            this.specDetail = Object.assign({}, this.specialties[index])
            this.specDetailDialog = true;
        },
        updateSpec(name, detail, id){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang cập nhật thông tin chuyên môn...')
            let url = `${config.apiUrl}/specialties`
            let body = {
                name: name,
                detail: detail,
                id: id
            }
            apiService.putApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Sửa chuyên môn thành công',
                        type: 'success',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Sửa chuyên môn thành công'})
                    this.getSpecialties()
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
            // this.specDetailDialog = false;
        },
        getAllDisease(page, size, searchObj){
            this.loadingDisease = true;
            let params = {
                page: page,
                size: size
            }
            let searchString = '';
            //Loop through all property of DiseaseSearch Obj
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
            let url = `${config.apiUrl}/diseases`
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.diseasePages = result.data.totalPages
                    this.updateAllDiseaseFromServer(result.data.content)
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
                this.loadingDisease = false;
            })
        },
        updateAllDiseaseFromServer(diseaseArray){
            this.allDisease = diseaseArray;
        },
        createNewDisease(name, description){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang tạo căn bệnh mới...')
            let url = `${config.apiUrl}/diseases`
            let body = {
                name: name,
                description: description
            }
            apiService.postApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Tạo căn bệnh thành công',
                        type: 'success',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Tạo căn bệnh thành công'})
                    this.createDisease.name = '';
                    this.createDisease.description = '';
                    this.getAllDisease(this.diseasePage, this.diseasePageSize)
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
        openDiseaseDetailDialog(id){
            let index = this.findObjIndexById(this.allDisease, id);
            this.diseaseDetail = Object.assign({}, this.allDisease[index])
            this.diseaseDetailDialog = true;
        },
        updateDisease(name, description, id){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang cập nhật căn bệnh...')
            let url = `${config.apiUrl}/diseases`
            let body = {
                name: name,
                description: description,
                id: id
            }
            apiService.putApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Sửa căn bệnh thành công',
                        type: 'success',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Sửa căn bệnh thành công'})
                    this.getAllDisease(this.diseasePage, this.diseasePageSize)
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
            // this.specDetailDialog = false;
        },
        createHealthIndexes(name, description, fields){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang tạo chỉ số sức khỏe...')
            let body = {
                name: name,
                description: description,
                fields: fields
            }
            let url = `${config.apiUrl}/health_indexes`
            apiService.postApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Tạo chỉ số sức khỏe mới thành công',
                        type: 'success',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Tạo chỉ số sức khỏe mới thành công'})
                    this.healthIndexesPages = 1
                    this.getHealthIndexes(this.healthIndexesPage, this.healthIndexesPageSize)
                    this.createHealthIndexesObj = {
                        name: '',
                        description: '',
                        fields: []
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
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.loadingHealthIndexes = false;
            })
        },
        addField(indexId, field){
            if(field.length > 0){
                this.$store.dispatch('turnOnLoadingDialog', 'Đang thêm trường...')
                let url = `${config.apiUrl}/health_indexes/${indexId}/field`
                let body = {
                    field: field
                }
                apiService.postApi(url, body).then(result => {
                    if(result.status.toString()[0] === "2"){
                        this.$toast.open({
                            message: 'Thêm trường thành công',
                            type: 'success',
                            // all other options may go here
                        })
                        // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Thêm trường thành công'})
                        this.detailHealthIndexes = result.data
                        this.healthIndexesNewField = ''
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
            }
            else {
                return;
            }
        },
        deleteField(indexId, fieldId){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang xóa trường...')
            let url = `${config.apiUrl}/health_indexes/${indexId}/field`
            let body = {
                id: fieldId
            }
            apiService.deleteApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Xóa trường thành công',
                        type: 'success',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Xóa trường thành công'})
                    this.detailHealthIndexes = result.data
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
        updateHealthIndexes(id, name, description){
            this.$store.dispatch('turnOnLoadingDialog', 'Đang cập nhật thông tin...')
            let body = {
                id: id,
                name: name,
                description: description
            }
            let url = `${config.apiUrl}/health_indexes`
            apiService.putApi(url, body).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.$toast.open({
                        message: 'Cập nhật thành công',
                        type: 'success',
                        // all other options may go here
                    })
                    // this.$store.dispatch('turnOnAlert', {color: 'success', message: 'Cập nhật thành công!'})
                    this.detailHealthIndexes = result.data
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
    },
    created(){
        if(this.user != null && this.user.role != 'COORDINATOR'){
            this.doctorHeaders.splice(this.doctorHeaders.length - 1, 1)
            this.specHeaders.splice(this.specHeaders.length - 1, 1)
            this.diseaseHeaders.splice(this.diseaseHeaders.length - 1, 1)
            this.healthIndexesHeaders.splice(this.healthIndexesHeaders.length - 1, 1)
        }
        this.registerObj.dateOfBirth = new Date().toISOString().substr(0, 10)
        this.getAllDoctor(this.doctorPage, this.doctorPageSize, this.doctorSearch)
        this.getAllDisease(this.diseasePage, this.diseasePageSize, this.diseaseSearch)
        this.getSpecialties()
        this.getHealthIndexes(this.healthIndexesPage, this.healthIndexesPageSize)
    }

}
</script>
<style scoped>

</style>