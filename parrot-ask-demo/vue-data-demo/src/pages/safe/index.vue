<template>
  <div class="home">
    <Tabbar title="安全中心" :leftArrow="true" />
    <van-cell title="修改密码" is-link to="lower" />
    <van-cell title="修改二级密码" is-link to="high" />
    <van-cell title="修改二级密码" is-link to="index" v-show="false"/>
  </div>
</template>

<script>
import Vue from "vue";
import url from "../../assets/js/api.js";
import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    console.log(Tabbar);
  },
  data() {
    return {

    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.home {
  font-size: 14px;
  color: white;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  min-height: 640px;
  .van-cell{
      width: 96%;
      color:#333333;
      background: transparent;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/safe/index.vue