<template>
  <div class="home">
    <van-nav-bar title="详情" left-arrow @click-left="go('order-add')" ></van-nav-bar>
    <div class="card">
        <van-cell-group>
        <van-field v-model="password" type="password" label="手机号码" placeholder="请输入" />
        <van-field v-model="password" type="password" label="备注" placeholder="请输入" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import url from "../../assets/js/api.js";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";
export default {
  data() {
    return {
      arr: [1, 2, 3],
      slides:[1,2,3]
    };
  },
  mounted() {       
  },
  methods: {
    go(res) {
      this.$router.go(-1);
      // console.log(res);
      // this.$router.push({ name: res });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
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
// src/pages/handle/detail.vue