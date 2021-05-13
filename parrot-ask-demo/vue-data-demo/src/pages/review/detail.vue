<template>
  <div class="home">
    <van-nav-bar title="详情" left-arrow @click-left="go('review')" right-text="编辑" @click-right="go('reviewedit')"></van-nav-bar>
    <div class="card">
        <van-cell-group>
        <van-field v-model="temp.phone" label="手机号码" placeholder="" readonly="readonly"/>
        <van-field v-model="temp.deal_remarks" label="备注" placeholder="" readonly="readonly"/>
      </van-cell-group>
    </div>
    <button class="button" @click="del()">删除</button>
  </div>
</template>

<script>
import Vue from "vue";
import { visitPlanDetail,delVisitPlan} from "@/api/index";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";
import { debug } from 'util';
export default {
  data() {
    return {
      temp:[]
    };
  },
  created(){
    visitPlanDetail({receive_id:this.$route.params.id}).then(res=>{
         this.temp=res.result.data;
    })
  },
  mounted() {       
  },
  methods: {
    del(){
      delVisitPlan({receive_id:this.$route.params.id}).then(res=>{
         this.temp=res.result.data;
         this.go('review');
    })
    },
    go(res) {
      // console.log(res);
      this.$router.push({ name: res,params:{
        id:this.$route.params.id
      }});
    }
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.home {
  //  @{deep}.van-field{
  //    color: black;
  //  }
   .button {
    width: 76%;
    height: 0.7rem;
    background: #eba436;
    border-radius: 0.3rem;
    border: none;
    color: white;
    font-size: 14px;
    display: block;
    margin: 0 auto;
    margin-top: 0.5rem;
  }
  .card{
    margin: 20px auto;
    width: 90%;
    height: 3rem;
    background: white;
    border-radius: 0.3rem;
    overflow: hidden;
  }
  .van-nav-bar {
    width: 100%;
  }
  font-size: 12.5px;
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
// src/pages/review/detail.vue