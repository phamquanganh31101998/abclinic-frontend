<template>
  <v-app>
    <loading-dialog/>
    <router-view></router-view>
    <alert/>
  </v-app>
</template>

<script>
import alert from '../src/components/Alert'
import loadingDialog from '../src/components/LoadingDialog'
export default {
  name: 'App',

  components: {
    alert, loadingDialog
  },

  data: () => ({
    //
  }),
  computed: {

  },
  methods: {

  }
};
</script>
