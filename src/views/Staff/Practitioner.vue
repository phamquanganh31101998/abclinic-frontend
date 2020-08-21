<template>
    <v-container>
        <patient-component></patient-component>
        <health-indexes-component></health-indexes-component>
    </v-container>
</template>
<script>
import healthIndexesComponent from '../../components/HealthIndexes'
import patientComponent from '../../components/Patient'
export default {
    components: {
        healthIndexesComponent, patientComponent
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
    },
    created(){
    }
}
</script>
<style scoped>

</style>