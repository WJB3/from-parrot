<template>
  <div class="home">
    <Tabbar title="注册" :leftArrow="true" />
    <van-field
      label="推荐码"
      placeholder="请输入推荐码"
      @blur="change()"
      v-model="uuid"
      :readonly="readonly"
    />
    <!-- <van-field label="推荐人账号" placeholder="请输入推荐人账号" v-model="parent_member" :readonly="readonly" />
    <van-field label="推荐人昵称" placeholder="请输入推荐人昵称" v-model="nick" :readonly="readonly" /> -->
    <van-field label="昵称" placeholder="请输入昵称" v-model="temp.nick_name" />
    <van-field label="密码" placeholder="请输入密码" v-model="temp.password" type="password" />
    <van-field label="确认密码" placeholder="请确认密码" v-model="temp.password_re" type="password" />
    <van-field label="支付密码" placeholder="请输入支付密码" v-model="temp.pay_password" type="password" />
    <van-field label="确认支付密码" placeholder="请确认支付密码" v-model="temp.pay_password_re" type="password" />
    <!-- <van-field label="真实姓名" placeholder="请输入真实姓名" v-model="temp.name" />
    <van-field label="身份证号" placeholder="请输入身份证号" v-model="temp.card" /> -->
    <van-field label="手机号" placeholder="请输入手机号" v-model="temp.phone" />
    <van-field label="验证码" placeholder="请输入验证码" v-model="temp.code" />
    <div class="buttons">
      <button class="button" @click="send()" ref="button">{{disabled?time+'s':'获取验证码'}}</button>
    </div>
    <button class="submit" @click="submit()">确定</button>
  </div>
</template>

<script>
import { recommendInfo, sendSms, registerCommit } from "@/api/home";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    if (this.$route.query.uuid) {
      this.readonly = true;
      this.uuid = this.$route.query.uuid;
      this.change();
    }
    this.fromType = this.$route.query.type;
  },
  data() {
    return {
      readonly: false,
      time: 60,
      disabled: false,
      timer: null,
      uuid: "",
      parent_member: "",
      nick: "",
      temp: {
        nick_name: "",
        password: "",
        password_re: "",
        pay_password: "",
        pay_password_re: "",
        phone: "",
        code: "",
        // name: "",
        // card: ""
      }
    };
  },
  mounted() {},
  methods: {
    submit() {
      registerCommit({ ...this.temp, parent_member: this.parent_member })
        .then(res => {
          if (this.fromType == 2) {
          } else {
            this.$router.push({ name: "login" });
          }
        })
        .catch(err => {});
    },
    send() {
      if (this.temp.phone !== undefined) {
        sendSms({ phone: this.temp.phone })
          .then(res => {
            this.time = 60;
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
          })
          .catch(err => {});
      }
    },
    change() {
      recommendInfo({ uuid: this.uuid }).then(res => {
        this.parent_member = res.member;
        this.nick = res.nick_name;
        this.readonly = true;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.home {
  font-size: 14px;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  min-height: 640px;
  padding-bottom: 5px;
  .buttons {
    position: relative;
   
      }
  /deep/ .van-cell__value {
    input {
      // color: #f8f8f8;
    }
  }
  .relative {
    position: relative;
  }
  .img {
    padding: 20px 0 0 20px;
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
    }
  }
  .button {
    position: absolute;
    right: 20px;
    bottom: 10px;
    width: 90px;
    color: #ffffff;
    background: #fba318;
    height: 25px;
    border-radius: 20px;
    border: 1px solid sandybrown;
    text-align: center;
  }
  .submit {
    border: none;
    color: #ffffff;
    background: #fba318;
    display: block;
    font-size: 18px;
    border-radius: 4px;
    margin: 6px auto;
    width: 90%;
    height: 38px;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/login/setting.vue