<template>
  <div class="home">
    <Tabbar title="羽毛" :leftArrow="true" rightText="转出" goUrl="feed-output" />
    <div class="header1">
      <div style="color:#FBA318">{{pet}}</div>
      <div>当前</div>
    </div>
    <div class="content1">
      <div style="padding:15px">羽毛获取方法</div>
      <div style="padding-left:15px">1.向推荐人购买（线下付款，推荐人转入）</div>
      <div style="padding:15px 0 0 15px;">2.线上充值</div>
      <div class="button" @click="go('feed-charge')">充值</div>
    </div>
    <!-- @click="go('order-detail',item.id)" -->
    <div class="card" v-for="(item,index) in arr" :key="index">
      <div class="content">
        <div class="phone">{{item.member}}</div>
        <div class="time" style="color:#17A216">+{{item.account}}</div>
      </div>
      <div class="content">
        <div class="phone">{{item.create_time}}</div>
        <div class="time">{{item.bill_type}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { petBill, userAccount } from "@/api/home";
import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    userAccount().then(res => {
      this.pet = res.pet;
    });
    petBill().then(res => {
      this.arr = res;
    });
  },
  data() {
    return {
      pet: "",
      arr: []
    };
  },
  mounted() {},
  methods: {
    go(res) {
      this.$router.push({ name: res });
    },
    goMy() {
      this.$router.push({ path: "/my" });
    }
  }
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
  color: #ffffff;
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
    color: #c1c1c1;
    background: #ffeee7;
  }
  .content1 {
    color: #ff6531;
    width: 100%;
    background: #ffeece;
    overflow: hidden;
    padding: 15px 0;
  }
  .card {
    margin: 0.2rem 0.3rem;
    color: #c1c1c1;
    .header {
      margin-bottom: 0.2rem;
    }
    .content {
      margin-bottom: 0.2rem;
      display: flex;
      justify-content: space-between;
      .time {
        color: #c1c1c1;
      }
    }
    border-bottom: 1px solid #c1c1c1;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/feed/index.vue