<template>
  <div class="home">
    <van-nav-bar title="统计分析" left-arrow @click-left="go('situation')"></van-nav-bar>
    <van-tabs v-model="active" line-width="50" @change="change">
      <van-tab title="日通话">
        <div class="card" v-for="(item,index) in temp" :key="index">
      <div style="margin-left:10px;width:60px;height:20px">{{item.name}}</div>
      <div style="margin-left:20px">{{item.phone}}</div>
      <div style="margin-left:100px;color:#ccc;font-size:12.5px">{{item.create_time}}</div>
    </div>
      </van-tab>
      <van-tab title="月通话">
        <div class="card" v-for="(item,index) in temp" :key="index">
      <div style="margin-left:10px;width:60px;height:20px">{{item.name}}</div>
      <div style="margin-left:20px">{{item.phone}}</div>
      <div style="margin-left:100px;color:#ccc;font-size:12.5px" >{{item.create_time}}</div>
    </div>
      </van-tab>
    </van-tabs>
    <van-pagination @change="changePage()" v-model="currentPage" :page-count="Math.ceil(total/9)" mode="simple" />
  </div>
</template>

<script>
import Vue from "vue";
import { receiveTasks, unreceiveGroup,statisticsList } from "@/api/index";

import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";
export default {
  data() {
    return {
      active: 0,
      arr: [1, 2, 3],
      slides: [1, 2, 3],
      temp: [],
      currentPage:1,
      total:''
    };
  },
  mounted() {},
  created() {
    this.getList(this.currentPage);
  },
  methods: {
    change(){
      if(this.active==0){
        this.getList(this.currentPage,0);
      }
      else if(this.active==1){
        this.getList(this.currentPage,1);
      }
    },
    changePage(){
       this.getList(this.currentPage);
    },
    getList(page,id) {
      statisticsList({pageindex:page,pagesize:9,type:id}).then(res => {
        this.temp = res.result.data;
        this.total = res.result.total;
      });
    },
    del(id) {
      receiveTasks({ group_id: id }).then(res => {
        this.getList();
      });
    },
    go(res) {
      console.log(res);
      this.$router.push({ name: res });
    }
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.home {
  position: relative;
  @{deep}.van-pagination{
    width: 100%;
    height: 40px;
    background: white;
    bottom: 0;
    position: fixed;
  }
  @{deep}.van-tabs__line{
    background: #eba436;
  }
  .card {
    img {
      width: 35px;
    }
    .button {
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
    padding-bottom: 10px;
    width: 92%;
    border-bottom: 1px solid #C1C1C1;
    // height: 80px;
    // background: white;
    // border-radius: 0.2rem;
    // overflow: hidden;
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
// src/pages/statistics/index.vue