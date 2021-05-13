<template>
  <div class="home">
    <div class="logo">
       <img src="../../assets/images/login/bird.png" alt />
      <!-- <img src="../../assets/images/home/logo1.png" alt /> -->
    </div>
    <div class="reg-chunk">
      <div class="card">
        <img src="@/assets/images/home/phone.png" class="phoneIcon" />
        <input type="text" class="input" placeholder="请输入手机号" v-model="temp.phone" />
      </div>
      <div class="card">
        <img src="@/assets/images/home/mima.png" class="psdIcon" />
        <input type="password" class="input" placeholder="请输入验证码" v-model="temp.code" />
        <div class="btn">
          <button class="button" @click="send()" ref="button">{{disabled?time+'s':'获取验证码'}}</button>
        </div>
      </div>
      <div class="card">
        <img src="@/assets/images/home/mima.png" class="psdIcon" />
        <input type="password" class="input" placeholder="请输入新密码" v-model="temp.password" />
      </div>
      <div class="card">
        <img src="@/assets/images/home/mima.png" class="psdIcon" />
        <input type="password" class="input" placeholder="请确认新密码" v-model="temp.password_re" />
      </div>
      <div class="bottom">
        <div @click="go('reg')">注册账号</div>
        <div @click="go('login')">登录</div>
      </div>
      <button class="button" @click="submit()">确定</button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { forgetPassword, sendSms } from "@/api/home";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";
export default {
  data() {
    return {
      time: 30,
      disabled: false,
      timer: null,
      arr: [1, 2, 3],
      temp: {
        phone: "",
        code: "",
        password: "",
        password_re: ""
      }
    };
  },
  mounted() {},
  methods: {
    send() {
      if (this.temp.phone !== undefined) {
        sendSms({ phone: this.temp.phone }).then(res => {
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
        });
      }
    },
    submit() {
      forgetPassword(this.temp)
        .then(res => {
          this.$router.push({ name: "login" });
        })
        .catch(err => {});
    },
    go(res) {
      console.log(res);
      this.$router.push({ name: res });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  //background: url("~@/assets/images/home/background.png");
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  min-height: 640px;
   .logo {
    height: 268px;
    width: 100%;
    //background-image: url("../../assets/images/login/bg.png");
    background-size: cover;

    img {
      margin: 96.5px 112px 20.5px 112px;
      width: 135px;
      height: 151px;
    }
  }
  // .logo img {
  //   width: 120px;
  //   height: 65px;
  //   margin: 92px 0 60px;
  // }
  .bottom {
    color: #fff;
    width: 250px;
    margin: 10px auto;
    font-size: 11px;
    display: flex;
    justify-content: space-between;
  }
  .btn {
    position: relative;
    .button {
      position: absolute;
      right: 0px;
      bottom: 60px;
      width: 100px;
      height: 30px;
      color: #fba318;
      border-radius: 20px;
      border: 1px solid #fba318;
      text-align: center;
      line-height: 25px;
      background: transparent;
      font-size: 14px;
    }
  }
  .button {
    width: 270px;
    height: 0.8rem;
    background: #fba318;
    border-radius: 5px;
    font-size: 16px;
    border: none;
    color: white;
    display: block;
    margin: 0 auto;
    margin-top: 1rem;
  }
  .card {
    img {
      margin-top: 8px;
    }
    .phoneIcon {
      width: 17px;
      height: 26px;
    }
    .psdIcon {
      width: 18px;
      height: 22px;
    }
    .input {
      width: 140px;
      height: 20px;
      margin-left: 10px;
      background: transparent;
      font-size: 14px;
      color: #fff;
    }
    &:nth-child(5) {
      border-radius: 0px 0px 5px 5px;
    }
    &:nth-child(2) {
      border-radius: 5px 5px 0px 0px;
    }
    width: 250px;
    height: 39px;
    padding: 10px;
    // border-radius: 5px 5px 5px 5px;
    border-bottom: 1px solid #c1c1c1;
  }
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
// src/pages/login/register.vue