<template>
  <div class="home">
    <div class="logo"> 
    </div>
    <div class="login-chunk">
      <van-cell-group>
        <van-field
          v-model="temp.name"
          class="mb-3"
          clearable
          placeholder="请输入您的手机号码"
          @click-right-icon="$toast('question')"
        >
          <div slot="left-icon">
            <img src="@/assets/images/login/user.png" class="phoneIcon" />
          </div>
        </van-field>
        <van-field type="password" placeholder="请输入密码" v-model="temp.password">
          <div slot="left-icon">
            <img src="@/assets/images/login/cookie.png" class="psdIcon" />
          </div>
        </van-field>
      </van-cell-group>
      <div class="bottom">
        <div class="chooseWrap">
          <van-checkbox v-model="checked" checked-color="#07c160">记住密码</van-checkbox>
        </div>
        <div class="password" @click="go('register')" style="line-height:20.83px;">忘记密码?</div>
      </div>
      <button class="button" @click="submit()">
        <span>登陆</span>
      </button>
      <div class="toReg">
        还没有账号？
        <span class="register" @click="go('reg')">立即注册</span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { login } from "@/api/login";
import axios from "axios";
import { Card, Loading } from "vant";

Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";

export default {
  data() {
    return {
      checked: true,
      temp: {
        name: "",
        password: ""
      }
    };
  },
  mounted() {},
  methods: {
    submit() {
      login(this.temp)
        .then(res => {
          console.log("res", res);
          localStorage.setItem("usertoken", res.token);
          localStorage.setItem("once", 1);
          this.$router.push({ name: "home" });
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;

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

  .login-chunk {
    width: 100%;
  }

  .bottom {
    color: #fff;
    margin: 13.5px 37px 0 34.5px;
    /*margin: 20px auto;*/
    font-size: 11px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .chooseWarp {
      position: relative;
    }

    .text {
      display: inline-block;
      margin-left: 20px;
    }

    .choose1 {
      width: 15px;
      height: 15px;
      position: absolute;
    }

    .choose2 {
      position: absolute;
      width: 10px;
      height: 7px;
      left: 2%;
      top: 26%;
      // transform: translate(-50%, -50%);
    }
  }

  .button {
    width: 285px;
    height: 44.5px;
    background: rgba(255, 109, 0, 1);
    border-radius: 45px;
    margin: 37px 37.5px 0 37px;
    color: #fff;
    border: none;
    font-size: 18px;
    span {
      width: 30.5px;
      height: 16.5px;
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }

    /*width: 270px;*/
    /*height: 40px;*/
    /*background: #fba318;*/
    /*border-radius: 5px;*/
    /*font-size: 16px;*/
    /*border: none;*/
    /*color: #fff;*/
    /*display: block;*/
    /*margin: 0 auto;*/
    /*border-radius: 10px;*/
    /*margin-top: 1rem;*/
    /*line-height: 40px;*/
  }

  .van-cell-group {
    background: transparent;
    margin: 58px 37.5px 0 34.5px;
    .van-cell {
      background: transparent;
      border-bottom: 1px solid #3d3d3d;
      padding: 0;

      /deep/ .van-field__control {
        /*padding-left: 10px;*/
        font-size: 16px;
      }

      .van-field__left-icon img {
        margin-top: 3px;
      }

      .phoneIcon {
        width: 21.5px;
        height: 21px;
        margin: 0 9px 13px 10px;
      }

      .psdIcon {
        width: 17.5px;
        height: 18.5px;
        margin: 0 11px 10px 14px;
      }
    }
  }

  .card {
    width: 250px;
    padding: 0 10px;
    border-bottom: 1px solid #c1c1c1;
    border-radius: 5px 5px 0px 0px;
    overflow: hidden;

    img {
      margin-top: 15px;
    }

    .input {
      width: 140px;
      background: transparent;
      margin-left: 10px;
      font-size: 14px;
      color: #fff;
      display: inline-block;
      padding: 0.16rem 0;
    }

    &:nth-child(3) {
      border-radius: 0px 0px 5px 5px;
    }

    ::-webkit-input-placeholder {
      color: #fff;
      line-height: 1;
    }
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

  .toReg {
    width: 151px;
    height: 14.5px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(149, 149, 149, 1);
    margin: 48.5px 111px 0 113px;
    .register {
      color: #ff6d00;
    }
  }
}

/deep/ .van-checkbox__icon--round .van-icon {
  border: 2px solid rgba(142, 142, 142, 1);
  border-radius: 3px;
}

/deep/ .van-checkbox__label {
  color: #959595;
  font-size: 14px;
}
.mb-3 {
  margin-bottom: 15px;
}
.password {
  font-size: 14px;
  color: #959595;
  color: rgba(149, 149, 149, 1);
  font-weight: 400;
  width: 70.5px;
  height: 13.5px;
}
/*/deep/ .van-cell:not(:last-child)::after {*/
/*position: absolute;*/
/*box-sizing: border-box;*/
/*content: ' ';*/
/*pointer-events: none;*/
/*right: 0;*/
/*bottom: 0;*/
/*left: 0.33333rem;*/
/*border-bottom: 0.0625rem solid #ebedf0;*/
/*-webkit-transform: scaleY(.5);*/
/*transform: scaleY(.5);*/
/*}*/
</style>



// WEBPACK FOOTER //
// src/pages/login/index.vue