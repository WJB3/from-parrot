<template>
  <div class="home">
    <van-nav-bar title="详情" left-arrow @click-left="go('order-add')" ></van-nav-bar>
    <div class="card">
        <van-cell-group>
        <van-field v-model="temp.phone" label="手机号码" placeholder="请输入" readonly="readonly"/>
        <van-field v-model="temp.deal_remarks" label="备注" placeholder="请输入" />
      </van-cell-group>
    </div>
    <button class="button" @click="submit()">确定</button>
  </div>
</template>

<script>
import Vue from "vue";
import {editVisitPlan,visitPlanDetail} from "@/api/index";
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
      temp:{}
    };
  },
  mounted() {       
  },
  created(){
    visitPlanDetail({receive_id:this.$route.params.id}).then(res=>{
         this.temp=res.result.data;
    })
  },
  methods: {
    submit(){
      editVisitPlan({receive_id:this.$route.params.id,deal_remarks:this.temp.deal_remarks}).then(res=>{
              this.$router.push({ name: 'reviewdetail',params:{
                 id:this.$route.params.id
                 }});
      })
    },
    go(res) {
      this.$router.push({ name: 'reviewdetail',params:{
                 id:this.$route.params.id
                 }});
      // console.log(res);
      // this.$router.push({ name: res });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
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
// src/pages/review/edit.vue