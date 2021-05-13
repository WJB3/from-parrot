<template>
  <div class="home">
    <Tabbar title="设置" :leftArrow="true" />
    <van-cell title="个人信息" is-link to="info" />
    <van-cell title="修改二级密码" is-link to="index" v-show="false" />
    <button class="submit" @click="log()">安全退出</button>
  </div>
</template>

<script>
import Vue from "vue";
import { loginOut } from "@/api/home";
import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    console.log(Tabbar);
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    log() {
      loginOut().then(res => {
        // localStorage.removeItem("usertoken");
        localStorage.clear();
        this.$router.push({ name: "login" });
      });
    }
  }
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
  .submit {
    border: none;
    background: #fba318;
    display: block;
    font-size: 18px;
    border-radius: 4px;
    margin: 200px auto;
    width: 90%;
    height: 40px;
  }
  .van-cell {
    width: 96%;
    color: #333333;
    background: transparent;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/my/setting.vue