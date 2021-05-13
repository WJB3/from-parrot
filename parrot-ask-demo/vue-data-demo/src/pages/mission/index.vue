<template>
  <div class="home">
    <van-nav-bar title="领取任务" left-arrow @click-left="go('home')" ></van-nav-bar>
    <div class="card" v-for="(item,index) in temp" :key="index">
        <div style="margin-left:20px">
          <img src="@/assets/images/handle/2.png">
        </div>
        <div style="margin-left:20px">{{item.group_name}}</div>
        <button class="button" style="margin-left:140px" @click="del(item.id)">领取任务</button>
    </div>
      <van-pagination @change="changePage()" v-model="currentPage" :page-count="Math.ceil(total/5)" mode="simple" />
  </div>
</template>

<script>
import Vue from "vue";
import {receiveTasks,unreceiveGroup} from "@/api/index";

import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";
export default {
  data() {
    return {
      arr: [1, 2, 3],
      slides:[1,2,3],
      temp:[],
      currentPage:'',
      total:''
    };
  },
  mounted() {       
  },
  created(){
      this.getList();
  },
  methods: {
    getList(page){
      // {group_id:this.$route.params.id}
        unreceiveGroup({pageindex:page,pagesize:5}).then(res=>{
          this.temp=res.result.data
          this.total = res.result.total;
        })
      },
    del(id){
        receiveTasks({group_id:id}).then(res=>{
          this.getList();
        })
    },
    go(res) {
      console.log(res);
      this.$router.push({ name: res });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  @deep: ~">>>";
  position: relative;
  @{deep}.van-pagination{
    width: 100%;
    height: 40px;
    background: white;
    bottom: 0;
    position: fixed;
  }
  .card{
    img{
      width: 35px;
    }
    .button{
      width: 70px;
      height: 28px;
      border: none;
      border-radius: 20px;
      font-size: 14px;
      background: #eba436;
      color: #f8f8f8;
      line-height: 28px;
    }
    display: flex;
    align-items: center;
    margin: 20px auto;
    width: 92%;
    height: 80px;
    background: white;
    border-radius: 0.2rem;
    overflow: hidden;
  }
  .van-nav-bar {
    width: 100%;
  }
  font-size: 14px;
  [class*="van-hairline"]::after {
    border: 0;
  }
  .van-nav-bar {
    background: #eba436;
  }
  .van-nav-bar__title {
    color: #f8f8f8;
  }
  .van-nav-bar__text {
    color: #f8f8f8;
  }
  .van-nav-bar .van-icon {
    color: #f8f8f8;
  }
  .van-cell__title {
    margin-left: 0.7rem;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/mission/index.vue