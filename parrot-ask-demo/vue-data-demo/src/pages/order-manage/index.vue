<template>
  <div class="home">
    <van-nav-bar title="签单管理" left-arrow right-text="添加" @click-right="go('order-add')" @click-left="go('situation')"></van-nav-bar>
    <div class="card" v-for="(item,index) in arr" :key="index" @click="go('order-detail',item.id)">
       <div class="header">{{item.customer_name}}</div>
       <div class="content">
           <div class="phone">{{item.customer_phone}}</div>
           <div class="time">{{item.create_time}}</div>
       </div>
    </div>
    <van-pagination @change="changePage()" v-model="currentPage" :page-count="Math.ceil(total/9)" mode="simple" />
  </div>
</template>

<script>
import Vue from "vue";
import { signList } from "@/api/index";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";

export default {
  data() {
    return {
        arr:[],
        currentPage:'',
        total:''
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    changePage(){
       this.getList(this.currentPage);
    },
    getList(page) {
      // {group_id:this.$route.params.id}
      signList({pageindex:page,pagesize:9}).then(res => {
        this.arr = res.result.data;
        this.total = res.result.total;
      });
    },
      go(res,id){
          this.$router.push({name:res,params:{id:id}});
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
  font-size: 14px;
  .card{
     margin: 0.2rem 0.3rem;
     .header{
       margin-bottom: 0.2rem;
     }
     .content{
         margin-bottom: 0.2rem;
         display: flex;
         justify-content: space-between;
         .time{
             color: #C1C1C1;
         }
     }
     border-bottom: 1px solid #C1C1C1;
  }
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
// src/pages/order-manage/index.vue