<template>
  <div id="app">
    <button @click="handleClick">测试</button>
    <button @click="handleClick2">测试二</button>
  </div>
</template>

<script>
import antvL7Map from "./components/antv-L7-map";
import axios from 'axios';
export default {
  name: "App",
  components: {
    antvL7Map,
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
