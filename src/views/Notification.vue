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
                        {{ (item.isRead == true) ? 'Đã đọc' : 'Chưa đọc'}}
                    </template>
                    <template v-slot:item.more="{item}">
                        <a @click.stop="getDetailNoti(item.id)">Xem chi tiết</a>
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
            <v-col cols="12" sm="12" lg="12" md="12" xl="12">
                <v-btn @click="checkLocalStorage()">Click</v-btn>
                <!-- <iframe src="https://vnexpress.net/suc-khoe/tin-tuc" style="height: 800px; width: 100%;"></iframe> -->
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
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
            ]
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
        getDetailNoti(id){
            console.log(id)
        }
    },
    created(){
        this.getNoti(this.notiPage, this.notiPageSize)
        // this.checkUID()
        // this.test()
    }
}
</script>
<style scoped>

</style>
