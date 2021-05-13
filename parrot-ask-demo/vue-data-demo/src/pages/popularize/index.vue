<template>
  <div class="home">
    <Tabbar title="邀请好友" :leftArrow="true" />
    <div class="pageCon">
      <div class="textWrap">
        <div>
          我的邀请码：
          <p class="codeText">{{item.uuid}}</p>
        </div>
      </div>
      <div class="content">
        <div id="qrcode" style="border: 1px solid #FBA318;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Tabbar from "@/components/tabbar";
import { userAccount } from "@/api/home";
// import { setToken, getToken } from "@/utils/token";
// import axios from "axios";
// import { Card, Loading } from "vant";
import Clipboard from "clipboard";
import QRCode from "qrcodejs2";
import { Toast } from "vant";
import { Waterfall } from "vant";
export default {
  components: { Tabbar },
  data() {
    return {
      arr: [1, 2, 3],
      temp: {},
      root: "",
      item: {},
      copyContent: ""
    };
  },
  created() {
    userAccount().then(res => {
      this.item = res;
    });
  },
  mounted() {
    userAccount().then(res => {
      this.item = res;
      this.qrcode();
      this.copyContent = `http://${window.location.host}/#/reg?uuid=${this.item.uuid}&type=2`;
    });
    const clipboard = new Clipboard("#copyBtn");
    clipboard.on("success", function(e) {
      e.clearSelection();
      Toast("注册地址已复制，快去分享吧");
    });
  },
  methods: {
    qrcode() {
      let qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 150,
        height: 150, // 高度  [图片上传失败...(image-9ad77b-1525851843730)]
        text: `http://${window.location.host}/#/reg?uuid=${this.item.uuid}&type=2` // 二维码内容
      });
    },
    submit() {
      // appLogin(this.temp).then(res => {
      //   setToken("token", res.res.token);
      //   this.$router.push({ name: "home" });
      // });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  //background: url("~@/assets/images/home/qcode.png");
  background-size: 100% 100%;
  .btn {
    width: 100px;
    height: 60px;
    color: #f8f8f8;
    padding: 8px 10px;
    border: none;
    margin-top: 20px;
    background: #cb5335;
  }
  .pageCon {
    width: 90%;
    height: 250px;
    background:  rgba(255,255,255,0.3);// background: #fff;
    border-radius: 4px;
    text-align: center;
    margin: 0 auto;
    color: #333;
    padding: 33px 0;
    margin-top: 110px;
    position: relative;
  }
  .content {
    text-align: center;
    width: 150px;
    height: 151px;
    position: absolute;
    left: 51%;
    transform: translateX(-50%);
    top: 43%;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;
    align-items: center;
    .bottom {
      margin: 10px;
    }
    .header {
      margin: 10px;
    }
  }
  font-size: 15px;
  [class*="van-hairline"]::after {
    border: 0;
  }
  .codeText {
    color: #fff;
    background: #fba318;
    height: 26px;
    width: 155px;
    margin: 0 auto;
    line-height: 26px;
    margin-top: 16px;
    border-radius: 10px;
  }
  .van-nav-bar {
    width: 100%;
    background-color: transparent;
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
  #qrcode {
    padding: 4px;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/popularize/index.vue