<template>
  <div class="home">
    <van-nav-bar title="业务知识库" left-arrow @click-left="go('situation')"></van-nav-bar>
    <div class="body">
      <div class="title">{{temp.title}}</div>
      <div class="content" v-html="temp.contents"></div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { initMaterial } from "@/api/index";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";

export default {
  data() {
    return {
      arr: [1, 2, 3],
      temp: {}
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      initMaterial({ id: this.$route.params.id }).then(res => {
        this.temp = res.result.data;
      });
    },
    go(res, params) {
      this.$router.push({ name: res, params: params });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  font-size: 12.5px;
  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      margin: 20px 0;
    }
    .content {
      width: 90%;
    }
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
// src/pages/know/detail.vue