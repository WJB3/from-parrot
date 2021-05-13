<template>
  <div class="home">
    <Tabbar title="修改密码" :leftArrow="true" />
    <div class="card">
      <div style="margin-left:8px;margin-top:6px">
        <img src="@/assets/images/safe/1.png" width="20px" />
      </div>
      <input type="text" placeholder="请输入验证码" v-model="temp.code" />
      <div class="button" @click="send()" ref="button">{{disabled?time+'s':'获取验证码'}}</div>
    </div>
    <div class="card">
      <div style="margin-left:8px;margin-top:6px">
        <img src="@/assets/images/safe/2.png" width="20px" />
      </div>
      <input type="password" placeholder="请输入密码" v-model="temp.password" />
    </div>
    <div class="card">
      <div style="margin-left:8px;margin-top:6px">
        <img src="@/assets/images/safe/2.png" width="20px" />
      </div>
      <input type="password" placeholder="请输入新密码" v-model="temp.password_re" />
    </div>
    <button class="submit" @click="submit()">确认修改</button>
  </div>
</template>

<script>
import Vue from "vue";
import { sendSms1, resetPassword } from "@/api/home";
import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    console.log(Tabbar);
  },
  data() {
    return {
      time: 30,
      disabled: false,
      timer: null,
      temp: {}
    };
  },
  mounted() {},
  methods: {
    submit() {
      resetPassword(this.temp).then(res => {
        this.$router.push({ name: "my" });
      });
    },
    send() {
      this.time = 30;
      this.disabled = true;
      this.$refs.button.disabled = true;
      this.timer = setInterval(() => {
        this.time--;
        if (this.time == 0) {
          this.$refs.button.disabled = false;
          this.disabled = false;
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
      sendSms1({ phone: this.temp.phone }).then(res => {});
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  margin-bottom: 50px;
  font-size: 14px;
  // color: white;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  min-height: 667px;
  .van-cell {
    width: 96%;
    background: transparent;
  }
  .submit {
    border: none;
    color: #ffffff;
    background: #FBA318;
    display: block;
    border-radius: 4px;
    margin: 100px auto;
    width: 90%;
    height: 40px;
  }
  .card:nth-child(0) {
    background: red;
    margin-top: 32px;
  }
  .card {
    input {
      margin-left: 10px;
      width: 60%;
      background: transparent;
    }
    .button {
      &:hover {
        cursor: pointer;
      }
      width: 100px;
      height: 35px;
      background: #FBA318;
      border-radius: 4px;
      text-align: center;
      line-height: 35px;
      color: #ffffff;
    }
    display: flex;
    margin: 15px auto;
    width: 90%;
    height: 35px;
    border: 1px solid #aaa4a2;
    border-radius: 4px;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/safe/lower.vue