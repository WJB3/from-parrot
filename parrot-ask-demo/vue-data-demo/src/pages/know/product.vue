<template>
  <div class="home">
    <van-nav-bar title="业务知识库" left-arrow @click-left="go('situation')"></van-nav-bar>
    <div class="card" @click="go('knowDetail',item.id)" v-for="(item,index) in temp" :key="index">
      <div class="left">
       <div class="header">
         <div style="display:flex">
          <img src="@/assets/images/handle/word.png">
          
           <div class="phone">{{item.title}}</div>
           </div>
           <div class="time">{{item.create_time}}</div>
       </div>
       <!-- <div class="content">
           <div class="time">123123123</div>
       </div> -->
       </div>
       <!-- <div class="right">sss</div> -->
    </div>
      <van-pagination @change="changePage()" v-model="currentPage" :page-count="Math.ceil(total/10)" mode="simple" />
  </div>
</template>
<script>
import Vue from "vue";
import {materialsList} from "@/api/index";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";

export default {
  data() {
    return {
        arr:[1,2,3],
        temp:[],
         currentPage:'',
        total:''
    };
  },
  created(){
      this.getList();
  },
  mounted() {},
  methods: {
    changePage(){
       this.getList(this.currentPage);
    },
      getList(){
        materialsList({type:0}).then(res=>{
          this.temp=res.result.data
            this.total = res.result.total;
        })
      },
      go(res,params){
          
          this.$router.push({name:res,params:{id:params}});
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
  font-size: 12.5px;
  .card{
     .right{
       display: flex;
       align-items: center;
       margin-left: 160px;
       font-size: 12px;
     }
     display: flex;
     margin: 0.2rem 0.3rem;
     .header{
       img{
         width:25px;
         margin-top:-7px;
         margin-right: 20px;
       }    
       width: 320px;
       margin: 0.3rem 0;
       display: flex;
       justify-content: space-between;
       .time{
             color: #C1C1C1;
             font-size: 11px;
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
// src/pages/know/product.vue