<template>
  <div class="home">
    <van-nav-bar title="回款单" left-arrow right-text="添加" @click-right="go('add-fund')" @click-left="go('situation')"></van-nav-bar>
    <div class="card" v-for="(item,index) in temp" :key="index">
       <div class="header">
           <div class="phone">{{item.customer_name}}</div>
           <div class="time" :class="{ 'class-a': item.status==0, 'class-b': item.status==1,'class-c': item.status==2}">{{(item.status==0&&'审核中')||(item.status==1&&'审核通过')||(item.status==2&&'拒绝')}}</div>
       </div>
       <div class="content">
           <div class="phone">{{item.customer_phone}}</div>
           <div class="time">{{item.verify_time}}</div>
       </div>
    </div>
     <van-pagination @change="changePage()" v-model="currentPage" :page-count="Math.ceil(total/9)" mode="simple" />
  </div>
</template>

<script>
import Vue from "vue";
import { backMoneyList} from "@/api/index";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";

export default {
  data() {
    return {
        temp:[]
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
        backMoneyList({pageindex:page,pagesize:9}).then(res=>{
           this.temp=res.result.data;
          this.total = res.result.total;
        })
    },
      go(res){
        console.log(res)
          this.$router.push({name:res});
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
       display: flex;
       justify-content: space-between;
       .time{
             color: #C1C1C1;
             font-size: 12px;
         }
        .class-a{
            color: #FE8E77;
        }
        .class-b{
          color:#FE8E77;
        }
        .class-c{
          color: #679FFE;
        }
     }
     .content{
         margin-bottom: 0.2rem;
         display: flex;
         justify-content: space-between;
         .time{
             color: #C1C1C1;
             font-size: 10px;
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
// src/pages/back-fund/index.vue