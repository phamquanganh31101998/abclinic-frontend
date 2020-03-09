<template>
    <v-container>
        <v-row>
            <v-col xs="12" sm="12" md="4" lg="4" xl="4">
                <v-btn @click="testMethod()">Click to test</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
    // import axios from 'axios'
    export default {
        data(){
            return {

            }
        },
        methods: {
            testMethod(){
                alert('dm')
                this.$router.push('/')
            }
        },
        created(){
            this.testMethod();
        }
    }
</script>
<style scoped>

</style>