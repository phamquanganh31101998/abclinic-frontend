<template>
    <v-dialog
        v-model="dialog"
        hide-overlay
        persistent
        width="300"
        >
        <v-card
            color="primary"
            dark
            >
            <v-card-text>
            <br>
            <p>{{message}}</p>
                <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                ></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    data(){
        return {

        }
    },
    computed: {
        ...mapGetters({
            dialog: 'loadingDialog',
            message: 'loadingMsg'
        })
    }
}
</script>
<style scoped>

</style>