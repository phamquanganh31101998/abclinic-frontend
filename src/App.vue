<template>
  <v-app>
    <router-view></router-view>
    <alert/>
  </v-app>
</template>

<script>
import alert from '../src/components/Alert'
// import AppBar from '../src/components/AppBar'
// import NavBar from '../src/components/NavBar'
export default {
  name: 'App',

  components: {
    alert
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
