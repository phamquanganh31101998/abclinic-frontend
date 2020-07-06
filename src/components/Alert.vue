<template>
    <v-snackbar
      :color="color"
      v-model="snackbar"
      :timeout="0"
        >
      {{ text }}
    </v-snackbar>
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
            color: 'alertColor',
            snackbar: 'alertSnackbar',
            text: 'alertMessage'
        })
    },
    watch: {
        '$store.state.alertSnackbar'(){
            if(this.$store.state.alertSnackbar == true){
                setTimeout(() => {
                    this.$store.dispatch('turnOffAlert')
                }, 4000)
            }
        }
    },
    methods: {
        turnOffAlert(){
            this.$store.dispatch('turnOffAlert')
        }
    }
}
</script>