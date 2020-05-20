import Vue from 'vue'
const EventBus = new Vue()
export default EventBus
export const eventBus = new Vue({
    data: {
  
    },
    methods: {
      newNotification(message){
        this.$emit('newNotification', message)
      }
    }
  })