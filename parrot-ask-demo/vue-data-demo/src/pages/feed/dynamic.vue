<template>
  <div class="home">
    <Tabbar title="动态收益" :leftArrow="true" />
    <div class="header1">
      <div style="color:#FBA318">{{income}}</div>
      <div>动态收益</div>
    </div>
    <div class="card" v-for="(item,index) in arr" :key="index" @click="go('order-detail',item.id)">
      <div class="content">
        <div class="phone">{{item.currency_name}}</div>
        <div class="time" style="color:#17A216">+{{item.account}}</div>
      </div>
      <div class="content">
        <div class="phone">{{item.bill_type}}</div>
        <div class="time">{{item.create_time}}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from "vue";
import { dynamicList, userAccount } from "@/api/home";
// import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    userAccount().then(res => {
      this.income = res.income;
    });
    dynamicList({ page: 1, pagesize: 10000 }).then(res => {
      this.arr = res;
    });
  },
  data() {
    return {
      income: "",
      arr: []
    };
  },
};
</script>

<style lang="less" scoped>
.home {
  min-height: 640px;
  font-size: 14px;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  color: #333333;
  /deep/ .van-tabs--line .van-tabs__wrap {
    height: 40px;
  }
  .button {
    width: 330px;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    background: #FBA318;
    border-radius: 5px;
    font-size: 16px;
    border: none;
    color: white;
    display: block;
    margin: 0 auto;
    margin-top: 0.5rem;
  }
  .header1 {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 55px;
    color: black;
    background: #ffeee7;
  }
  .content1 {
    color: #ff6531;
    width: 100%;
    height: 150px;
    background: #ffeece;
  }
  .card {
    margin: 0.2rem 0.3rem;
    .header {
      margin-bottom: 0.2rem;
    }
    .content {
      margin-bottom: 0.2rem;
      display: flex;
      justify-content: space-between;
      .time {
        color: #333333;
      }
    }
    border-bottom: 1px solid #c1c1c1;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/feed/dynamic.vue