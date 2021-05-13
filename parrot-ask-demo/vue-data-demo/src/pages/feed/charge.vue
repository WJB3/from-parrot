<template>
  <div class="home">
    <Tabbar title="充值" :leftArrow="true" />
    <van-cell title="收款方式" is-link :value="typeName" @click="show=true" />
    <van-action-sheet
      :close-on-click-overlay="false"
      v-model="show1"
      :actions="option1"
      @select="onSelect1"
    />
    <van-action-sheet
      :close-on-click-overlay="false"
      v-model="show"
      :actions="option"
      @select="onSelect"
    />
    <div v-show="type==1">
      <van-cell title="开户银行" :value="temp.bank_name" />
      <van-cell title="开户支行" :value="temp.bank_open" />
      <van-cell title="开户姓名" :value="temp.bank_open_name" />
      <van-cell title="银行卡号" :value="temp.bank_number" />
    </div>
    <div v-show="type==3">
      <van-cell title="微信名" :value="temp.wx_name" />
      <van-cell title="微信号" :value="temp.wx_number" />
      <div v-show="wxImg" class="imgWrap">
        <p>平台收款码:</p>
        <img :src="temp.wx_image" alt class="chargeImg" @click="showPicFullscreen(temp.wx_image)" />
      </div>   
    </div>
    <div v-show="type==2">
      <van-cell title="支付宝名" :value="temp.ali_name" />
      <van-cell title="支付宝号" :value="temp.ali_number" />
      <div v-show="aliImg" class="imgWrap">
        <p>平台收款码:</p>
        <img
          :src="temp.ali_image"
          alt
          class="chargeImg"
          @click="showPicFullscreen(temp.ali_image)"
        />
      </div>
    </div>
    <van-cell title="充值币种" is-link :value="typeName1" @click="show1=true" />
    <van-field label="充值数量" placeholder="请输入充值数量" v-model="num" />
    <van-cell title="到账金额" :value="(item.rate*num/100)||0" />
    <van-field label="备注" placeholder="请输入备注" v-model="remark" />
    <van-uploader :after-read="afterRead" style="margin:15px;" v-model="fileList" />
    <div style="margin-left:16px; color:#fff;">上传支付凭证</div>
    <div class="button" @click="submit()">提交</div>
  </div>
</template>

<script>
import Vue from "vue";
import {
  gatheringList,
  configRemittanceList,
  remittanceCommit,
  fileUpload
} from "@/api/home";
import axios from "axios";
import Tabbar from "@/components/tabbar";
import { ImagePreview } from "vant";
export default {
  components: { Tabbar },
  created() {
    configRemittanceList().then(res => {
      this.option1 = res;
    });
  },
  data() {
    return {
      wxImg: false,
      aliImg: false,
      remittance_id: "",
      num: "",
      remark: "",
      pay_voucher: "",
      typeName1: "请选择币种",
      show1: false,
      message: "",
      showDialog: false,
      value: "",
      showKeyboard: false,
      fileList: [],
      show: false,
      type: 1,
      typeName: "银行卡",
      option1: [],
      option: [
        {
          name: "银行卡",
          type: 1
        },
        {
          name: "支付宝",
          type: 2
        },
        {
          name: "微信",
          type: 3
        }
      ],
      arr1: ["购买中", "已购买", "已取消"],
      temp: {},
      is_buyer: "",
      item: {},
      obj: {}
    };
  },
  mounted() {},
  methods: {
    // 初始化
    initType(type) {
      gatheringList({ type: type }).then(res => {
        if (res[0]) {
          this.temp = res[0];
          if (res[0].ali_image) {
            this.aliImg = true;
          } else if (res[0].wx_image) {
            this.wxImg = true;
          }
        }
      });
    },
    submit() {
      remittanceCommit({
        pay_voucher: this.pay_voucher,
        money: this.num,
        remark: this.remark,
        remittance_id: this.remittance_id,
        pay_type: this.type
      }).then(res => {
        this.$router.push({ name: "feed" });
      });
    },
    afterRead(file) {
      let formData = new FormData();
      formData.append("image", file.file);
      fileUpload(formData).then(res => {
        this.pay_voucher = res.path;
      });
    },
    onSelect1(item) {
      this.item = item;
      this.remittance_id = item.id;
      this.show1 = false;
      this.typeName1 = item.name;
    },
    onSelect(item) {
      this.typeName = item.name;
      this.type = item.type;
      this.show = false;
      // 切换方式
      this.initType(this.type);
    },
    // 预览图片
    showPicFullscreen(picUrl) {
      ImagePreview([picUrl]);
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  min-height: 640px;
  font-size: 14px;
  color: white;
  padding-bottom: 20px;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  /deep/ .van-tabs--line .van-tabs__wrap {
    height: 38px;
  }
  /deep/ .van-tabs {
    width: 100%;
  }
  .van-tabs__nav {
    width: 100%;
  }
  .button {
    border: none;
    background: #fba318;
    display: block;
    text-align: center;
    line-height: 40px;
    border-radius: 4px;
    margin: 20px auto;
    width: 90%;
    height: 40px;
  }
  .qcode {
    margin: 15px;
    width: 100px;
    height: 100px;
    border: 1px solid #f2f2f2;
  }
  .card {
    .right {
      .buttons {
        margin-top: -0px;
        display: flex;
      }
      .confirm {
        width: 55px;
        text-align: center;
        line-height: 30px;
        height: 30px;
        background: #04e94a;
      }
      .cancel {
        margin-left: 20px;
        width: 55px;
        text-align: center;
        line-height: 30px;
        height: 30px;
        background: #e56a17;
      }
      .button {
        width: 148px;
        text-align: center;
        line-height: 30px;
        height: 30px;
        background: #e56a17;
        border-radius: 20px;
      }
      div {
        margin-top: 10px;
      }
      .top {
        margin-top: 20px;
        font-size: 16px;
        span:nth-child(2) {
          margin-left: 10px;
        }
      }
      flex: 1;
    }
    .image {
      margin: 30px 20px;
      width: 120px;
      display: inline-block;
    }
    display: flex;
    justify-content: flex-start;
    margin: 12px auto;
    width: 330px;
    height: 215px;
    //background: url("~@/assets/images/home/card.png");
    background-size: 100% 100%;
  }
  // 收款码
  .imgWrap {
    color: #fff;
    padding: 20px;
    .chargeImg {
      margin-top: 10px;
      width: 100px;
      height: 100px;
    }
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/feed/charge.vue