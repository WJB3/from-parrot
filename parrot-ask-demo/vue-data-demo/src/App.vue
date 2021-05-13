<template>
  <div id="app"> 
    <router-view></router-view>
  </div>
</template>

<script> 
import axios from 'axios';
export default {
  name: "App",
  components: { 
  },
  methods:{
    handleClick:function(){
      axios.get('http://127.0.0.1:3000/')
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleClick2:function(){
      axios.get('http://127.0.0.1:3000/detail')
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
};
</script>

<style>
</style>
