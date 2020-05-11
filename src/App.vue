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
// import AppBar from '../src/components/AppBar'
// import NavBar from '../src/components/NavBar'
export default {
  name: 'App',

  components: {
    alert, loadingDialog
    // AppBar, NavBar
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
