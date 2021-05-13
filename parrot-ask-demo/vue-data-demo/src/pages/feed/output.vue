<template>
  <div class="home">
    <Tabbar title="转出" :leftArrow="true" />
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
    <van-cell title="转账币种" is-link :value="typeName1" @click="show1=true" />
    <van-field label="对方账号" placeholder="请输入对方账号" v-model="target_member" />
    <van-field label="转账金额" placeholder="请输入转账金额" v-model="money" />
    <div class="button" @click="submit()">提交</div>
  </div>
</template>

<script>
import Vue from "vue";
import { configTransferList, transferCommit } from "@/api/home";
import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    configTransferList().then(res => {
      this.option1 = res;
    });
  },
  data() {
    return {
      target_member: "",
      remittance_id: "",
      money: "",
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
      obj: {},
      transfer_id:''
    };
  },
  mounted() {},
  methods: {
    submit() {
      if (this.transfer_id == "" || undefined) {
        this.$toast("请选择转账币种!");
        return;
      } else {
        transferCommit({
          transfer_id: this.transfer_id,
          target_member: this.target_member,
          money: this.money
        }).then(res => {
          this.$router.replace({ name: "feed" });
        });
      }
    },
    onSelect1(item) {
      this.item = item;
      this.transfer_id = item.id;
      this.show1 = false;
      this.typeName1 = item.name;
    },
    onSelect(item) {
      this.typeName = item.name;
      this.type = item.type;
      this.show = false;
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
  /deep/ .van-cell__value {
    input {
      // color: #f8f8f8;
    }
  }
  /deep/ .van-tabs--line .van-tabs__wrap {
    height: 38px;
  }
  /deep/ .van-tabs {
    width: 100%;
  }
  /deep/ .van-tab {
    // color: #f8f8f8;
  }
  .van-tabs__nav {
    width: 100%;
  }
  img {
    // position: absolute;
    // top:40px;
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
    background: red;
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
    &:last-child {
      // margin-bottom: 40px;
    }
    width: 330px;
    height: 215px;
    //background: url("~@/assets/images/home/card.png");
    background-size: 100% 100%;
    // background-position:center;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/feed/output.vue