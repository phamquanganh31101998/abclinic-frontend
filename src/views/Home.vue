<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <v-btn @click="logOut()">Click here</v-btn>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  data(){
    return {

    }
  },
  methods: {
    logOut(){
      this.$router.push('/login')
    }
  }
}
</script>
