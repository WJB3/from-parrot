<template>
  <div class="home">
    <Tabbar title="详情" :leftArrow="true" />
    <div class="card">
      <div>
        <img :src="item.image" class="image" />
      </div>
      <div class="right">
        <div class="top">
          <span style="color:#FBA318">{{item.name}}</span>
        </div>
        <div>价值：{{item.price}}</div>
        <div>购买时间：{{item.addtime}}</div>
        <div>预约/即抢购买消耗羽毛：{{item.appoint}}/{{item.purchase}}</div>
        <div>智能合约收益：{{item.day}}天/{{(item.day*item.bonus_rate*100).toFixed(0)}}%</div>
        <div>可挖HKT：{{item.coin_hkt}}</div>
        <div>可挖PHD：{{item.coin_phd}}</div>
        <div
          class="buttonss"
        >{{(item.status==1&&"待确认")||(item.status==0&&"待付款")||(item.status==6&&"自动确认")||(item.status==7&&"订单冻结")||(item.status==3&&"申诉中")||(item.status==8&&"已取消")||(item.status==4&&"申诉通过")||(item.status==5&&"申诉失败")||(item.status==2&&"已完成")}}</div>
        <!-- <div class="buttonss">{{item.status?'待确认':'待付款'}}</div> -->
      </div>
    </div>
    <div v-if="is_buyer">
      <div style="margin:15px">卖家信息</div>
      <van-cell title="订单号" :value="temp.ordernum" />
      <van-cell title="账号" :value="temp.seller_member" />
      <van-cell title="昵称" :value="temp.seller_nickname" />
      <van-cell title="收款方式" is-link :value="typeName" @click="show=true" />
      <van-action-sheet
        :close-on-click-overlay="false"
        v-model="show"
        :actions="option"
        @select="onSelect"
      />
      <div v-show="type==1">
        <van-cell title="开户银行" :value="temp.bankname" />
        <van-cell title="开户支行" :value="temp.branch" />
        <van-cell title="开户姓名" :value="temp.cardname" />
        <van-cell title="银行卡号" :value="temp.cardno" />
      </div>
      <div v-show="type==3">
        <van-cell title="微信名" :value="temp.wxname" />
        <van-cell title="微信号" :value="temp.wxno" />
        <img @click="showPicFullscreen(temp.wxqrcode)" :src="temp.wxqrcode" class="qcode" />
      </div>
      <div v-show="type==2">
        <van-cell title="支付宝名" :value="temp.aliname" />
        <van-cell title="支付宝号" :value="temp.alino" />
        <img @click="showPicFullscreen(temp.aliqrcode)" :src="temp.aliqrcode" class="qcode" />
      </div>
      <div v-if="item.status==0&&is_buyer==1">
        <van-uploader
          :after-read="afterRead"
          style="margin:15px;"
          v-model="fileList"
          :max-count="1"
          @delete="resetProof()"
        />
        <div style="margin-left:15px;">上传支付凭证</div>
      </div>
    </div>
    <div v-if="!is_buyer">
      <div style="margin:15px">买家信息</div>
      <van-cell title="账号" :value="temp.buyer_member" />
      <van-cell title="昵称" :value="temp.buyer_nickname" />
      <div style="margin:15px">付款凭证：</div>
      <img :src="temp.proof" width="200px" style="margin:15px" />
    </div>
    <div class="button1" v-if="is_buyer==0&&item.status==1" @click="appeal()">申诉</div>
    <div
      class="button"
      v-if="(item.status==0&&is_buyer==1)||(item.status==1&&is_buyer==0)"
      @click="submit()"
    >提交</div>
    <van-dialog
      v-model="showPassword"
      title="支付密码"
      show-cancel-button
      @confirm="pay"
      @cancel="cancelPay"
      :before-close="beforePasswordClose"
    >
      <van-password-input :value="password" info="密码为 6 位数字类型" style="position:initial" />
    </van-dialog>

    <van-number-keyboard
      id="keyboard-panel"
      :show="showPassword"
      @input="onInput"
      @delete="onDelete"
      :z-index="9999"
      style="color:black"
    />
    <van-dialog v-model="showDialog" title="申诉原因" show-cancel-button @confirm="confirm">
      <van-field
        style="background:white;color: black;margin-top:-10px;height:60px"
        v-model="message"
        label="申诉原因"
        type="textarea"
        placeholder="请输入申诉原因"
        rows="4"
        autosize
      />
    </van-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import {
  orderInfo,
  pay,
  fileUpload,
  confirm,
  appeal,
  checkPayPassword
} from "@/api/home";
import axios from "axios";
import { Toast } from "vant";
import { ImagePreview } from "vant";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {},
  data() {
    return {
      message: "",
      showDialog: false,
      password: "",
      showPassword: false,
      fileList: [],
      show: false,
      type: 1,
      typeName: "银行卡",
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
  created() {
    this.item = JSON.parse(localStorage.getItem("detail"));
    orderInfo({ id: this.$route.params.id }).then(res => {
      this.temp = res;
      this.is_buyer = res.is_buyer;
    });
  },
  mounted() {},
  methods: {
    //-------------输入密码开始
    beforePasswordClose(action, done) {
      if (action === "confirm") {
        if (this.password.length != 6) {
          done(false);
        } else {
          done();
        }
      } else {
        done();
      }
    },
    cancelPay() {
      this.password = "";
    },
    pay() {
      if (this.password.length != 6) {
        this.$toast("请输入6位数字密码");
        return false;
      }

      this.$toast.loading({ message: "处理中...", mask: true });
      checkPayPassword({ pay_password: this.password }).then(resp => {
        this.showPassword = false;
        pay({ ...this.obj, id: this.temp.id }).then(res => {
          Toast("购买成功");
          setTimeout(() => {
            this.$router.push({ name: "adopt-record" });
          }, 1500);
        });
      });
    },
    // 键盘相关事件响应
    onInput(key) {
      this.password = (this.password + key).slice(0, 6);
      this.zIndex = 9999;
    },
    onDelete() {
      this.password = this.password.slice(0, this.password.length - 1);
    },
    //------------- 输入密码结束

    submit() {
      if (this.is_buyer == 1) {
        if (this.obj.proof == "" || this.obj.proof == undefined) {
          this.$toast("请先上传支付凭证!");
          return;
        } else {
          this.showPassword = true;
          this.password = "";
        }
      } else {
        confirm({ id: this.item.id }).then(res => {
          Toast("确认成功");
          this.$router.push({ name: "tranform-record" });
        });
      }
    },
    confirm() {
      appeal({ id: this.item.id, type: 1, appealcause: this.message }).then(
        res => {
          Toast("申诉申请成功");
          this.$router.push({ name: "my" });
        }
      );
    },
    appeal() {
      this.showDialog = true;
    },
    resetProof() {
      this.obj.proof = "";
    },
    afterRead(file) {
      let formData = new FormData();
      formData.append("image", file.file);
      fileUpload(formData).then(res => {
        this.obj.proof = res.path;
      });
    },
    onSelect(item) {
      this.typeName = item.name;
      this.type = item.type;
      this.show = false;
    },
    // 图片全屏预览
    showPicFullscreen(picUrl) {
      ImagePreview([picUrl]);
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  /deep/ .van-password-input {
    width: 100%;
    margin-left: 0px;
    position: absolute;
    left: 0;
  }
  min-height: 640px;
  font-size: 12px;
  color: white;
  padding-bottom: 20px;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  .van-cell {
    color: white;
    width: 90%;
    margin: 0 5%;
    background: #666666;
  }
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
  .button1 {
    border: none;
    display: block;
    text-align: center;
    line-height: 40px;
    border-radius: 4px;
    margin: 20px auto;
    width: 90%;
    height: 40px;
    background: #e56a17;
  }
  .qcode {
    margin: 15px;
    width: 100px;
    height: 100px;
    background: #333333;
  }
  .card {
    .right {
      .buttonss {
        width: 148px;
        text-align: center;
        padding:10px 0;
        background: #e56a17;
        border-radius: 20px;
      }
      div {
        margin-top: 10px;
      }
      .top {
        margin-top: 10px;
        font-size: 16px;
        span:nth-child(2) {
          margin-left: 10px;
        }
      }
    }
    .image {
      margin: 30px 20px;
      width: 95px;
      display: inline-block;
    }
    display: flex;
    justify-content: flex-start;
    margin: 12px auto;
    width: 330px;
    height: 205px;
    //background: url("~@/assets/images/home/card.png");
    background-size: 100% 100%;
  }
  .popPsd {
    position: fixed;
    z-index: 2;
    left: 0;
    top: 0;
    background: #fff;
    transform: 0.5;
    overflow: hidden;
    height: auto;
    width: 100%;
  }
  /deep/ .van-dialog__header {
    color: #000;
  }

  .van-password-input {
    position: relative;
    width: 90%;
    margin: 0 auto;
    margin-top: 10px;
    li {
      border: 1px solid #c1c1c1;
    }
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/adopt/detail.vue