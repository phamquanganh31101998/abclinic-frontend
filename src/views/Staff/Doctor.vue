<template>
    <v-container>
        <patient-component></patient-component>
        <health-indexes-component></health-indexes-component>
    </v-container>
</template>
<script>
import patientComponent from '../../components/Patient'
import healthIndexesComponent from '../../components/HealthIndexes'
export default {
    components: {
        patientComponent, healthIndexesComponent
    },
    data(){
        return {
        }
    },
    computed: {
    },
    watch: {
    },
    methods: {
        goToPage(link){
            this.$router.replace(link)
        },
    },
    created(){
        if(this.user != null && this.user.role == 'COORDINATOR'){
            this.$toast.open({
                message: 'Trang này chỉ dành cho bác sĩ',
                type: 'error',
            })
            this.goToPage('/')
        }
    }
}
</script>
<style scoped>

</style>