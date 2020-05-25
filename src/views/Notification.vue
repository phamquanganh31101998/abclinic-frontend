<template>
  <v-container class="full-height">
      <v-row>
            <v-col>
                <h1>Thông báo</h1>
            </v-col>
        </v-row>
        <v-row class="fill-height">
            <v-col cols="12" md="12" sm="12" lg="12" xl="12">
                <v-data-table :headers="notiHeaders" 
                    no-data-text="Không có thông báo nào" loading-text="Đang lấy dữ liệu" :loading="loadingNoti"
                    :items="noti" class="elevation-4" hide-default-footer>
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title><h3>Danh sách thông báo</h3></v-toolbar-title>
                            <v-divider
                                class="mx-4"
                                inset
                                vertical
                            ></v-divider>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.sender="{ item }">
                        {{ item.sender.name }}
                    </template>
                    <template v-slot:item.isRead="{ item }">
                        <span v-if="item.isRead == true">Đã đọc</span>
                        <span style="color: red" v-else>Chưa đọc</span>
                    </template>
                    <template v-slot:item.more="{item}">
                        <a @click.stop="getDetailNoti(item.id, item.number)">Xem chi tiết</a>
                    </template>
                </v-data-table>
                <br>
                <div class="text-center">
                    <v-pagination
                        v-model="notiPage"
                        :length="notiPages"
                        @input="getNoti(notiPage, notiPageSize)"
                    ></v-pagination>
                </div>
            </v-col>
        </v-row>
        <v-dialog v-model="detailNotiDialog"  max-width="700px" persistent>
            <v-card >
                <v-card-title class="headline primary" primary-title>
                    <span style="color: white">Chi tiết thông báo</span>
                </v-card-title>
                <v-card-text v-if="detailNoti != null">
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <h3>Mã thông báo: {{detailNoti.id}}</h3>
                                <h3>Kiểu tư vấn: {{returnNotificationType(detailNoti.type)}}</h3>
                                <h3>Nội dung: {{detailNoti.message}}</h3>
                                <h3>Mã yêu cầu tư vấn tương ứng: {{detailNoti.payloadId}}</h3>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="1" lg="1" xl="1">
                                <v-avatar v-if="detailNoti.sender.avatar != null" width="50" height="50">
                                    <img
                                        :src="detailNoti.sender.avatar"
                                        >
                                </v-avatar>
                            </v-col>
                            <v-col cols="12" sm="12" md="5" lg="5" xl="5">
                                <h3>Người gửi: {{detailNoti.sender.name}}</h3>
                                <h3>Chức vụ: {{detailNoti.sender.role}} </h3>
                            </v-col>
                            <v-col cols="12" sm="12" md="1" lg="1" xl="1">
                                <v-avatar v-if="detailNoti.receiver.avatar != null" width="50" height="50">
                                    <img
                                        :src="detailNoti.receiver.avatar"
                                        >
                                </v-avatar>
                            </v-col>
                            <v-col cols="12" sm="12" md="5" lg="5" xl="5">
                                <h3>Người nhận: {{detailNoti.receiver.name}}</h3>
                                <h3>Chức vụ: {{detailNoti.receiver.role}} </h3>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer>
                    </v-spacer>
                    <v-btn @click="detailNotiDialog = false" text color="red">ĐÓNG</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
// import {eventBus} from '../eventBus'
import config from '../config'
import apiService from '../services/api.service'
export default {
    data(){
        return {
            noti: [],
            notiPage: 1,
            notiPages: 0,
            notiPageSize: 10,
            loadingNoti: false,
            notiHeaders: [
                { text: 'ID', value: 'id' , align: 'start'},
                { text: 'TRẠNG THÁI', value: 'isRead', align: 'start' },
                { text: 'NGƯỜI GỬI', value: 'sender', align: 'start' },
                { text: 'NỘI DUNG', value: 'message', align: 'start' },
                { text: 'CHI TIẾT', value: 'more', align: 'right' },
            ],
            detailNoti: null,
            detailNotiDialog: false,
        }
    },
    computed: {
        ...mapGetters({
            newNotification: 'newNotification'
        })
    },
    watch: {
        newNotification(){
            this.handleNewNotification()
        }
    },
    methods: {
        checkLocalStorage(){
            console.log(this.$store.state.ac_uid)
            console.log(this.$store.state.user)
        },
        getNoti(page, size){
            this.noti = [];
            this.loadingNoti = true;
            let url = `${config.apiUrl}/notifications`
            let params = {
                page: page,
                size: size
            }
            apiService.getApi(url, params).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.noti = result.data.content
                    for (let i = 0; i < this.noti.length; i++){
                        this.noti[i].number = i;
                    }
                    this.notiPages = result.data.totalPages
                }
                else {
                    this.$store.dispatch('turnOnAlert', {color: 'error', message: result.data.message})
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.loadingNoti = false;
            })
        },
        getDetailNoti(id, number){
            let url = `${config.apiUrl}/notifications/${id}`
            this.$store.dispatch('turnOnLoadingDialog', 'Lấy thông tin chi tiết thông báo...')
            apiService.getApi(url).then(result => {
                if(result.status.toString()[0] === "2"){
                    this.detailNoti = result.data
                    this.noti[number].isRead = true;
                    this.detailNotiDialog = true;
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
        handleNewNotification(){
            this.notiPage = 1;
            this.getNoti(this.notiPage, this.notiPageSize)
        },
        returnNotificationType(type){
            switch(type){
                case 0: 
                    return 'YÊU CẦU TƯ VẤN'
                case 1: 
                    return 'TƯ VẤN'
                case 2: 
                    return 'TRẢ LỜI TƯ VẤN'
                case 3: 
                    return 'GÁN QUYỀN QUẢN LÝ'
                case 4: 
                    return 'CHẤP NHẬN QUẢN LÝ'
                case 5: 
                    return 'TỪ CHỐI TƯ VẤN'
                case 6: 
                    return 'HỦY QUYỀN QUẢN LÝ'
                case 7: 
                    return 'ĐẶT LỊCH GỬI CHỈ SỐ SỨC KHỎE'
                case 8: 
                    return 'GỬI CHỈ SỐ SỨC KHỎE'
                case 9: 
                    return 'CÓ LỊCH GỬI CHỈ SỐ SỨC KHỎE PHẢI NỘP'
                case 10: 
                    return 'ĐÃ ĐƯỢC HỦY KÍCH HOẠT'
            }
        }
    },
    created(){
        // eventBus.$on('newNotification', this.handleNewNotification);
        this.getNoti(this.notiPage, this.notiPageSize)
        // this.checkUID()
        // this.test()
    },
    destroyed(){
        // eventBus.$off('newNotification', this.handleNewNotification);
    }
}
</script>
<style scoped>

</style>
