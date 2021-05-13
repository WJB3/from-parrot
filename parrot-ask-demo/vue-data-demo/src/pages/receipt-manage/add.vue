<template>
  <div class="home">
    <Tabbar title="添加银行卡" :leftArrow="true" />
    <div>
      <van-cell-group>
      <van-field v-model="username" label="开户银行" placeholder="请输入开户银行" style="width:95%"/>
      <van-field v-model="username" label="开户支行" placeholder="请输入开户支行" style="width:95%"/>
      <van-field v-model="username" label="开户姓名" placeholder="请输入开户姓名" style="width:95%"/>
      <van-field v-model="username" label="银行卡号" placeholder="请输入银行卡号" style="width:95%"/>
    </van-cell-group>
    </div>
    <!-- <div>
    <van-cell-group>
      <van-field v-model="username" label="支付宝账号" placeholder="请输入账号" style="width:95%"/>
      <van-field v-model="username" label="支付宝昵称" placeholder="请输入昵称" style="width:95%"/>
    </van-cell-group>
    <div style="margin:15px;">收款码</div>
    <van-uploader
      multiple 
      :after-read="afterRead1"
      style="margin-left:15px;"
      v-model="fileList1"
    />
    <div style="margin:15px;">上传收款码</div>
    </div> -->
    <div class="button">确定</div>
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
      arr: [1, 2, 3, 4, 5, 6, 7, 8]
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.home {
  min-height: 640px;
  font-size: 14px;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  color: #ffffff;
  // background: #40312b;
  .van-hairline--top-bottom::after {
    border: none;
  }
  // /deep/ .van-cell::after {
  //   border-bottom:1px solid #ebedf0;
  // }
  /deep/ .van-cell__value {
    input {
      // color: #f8f8f8;
    }
  }
  .van-cell-group{
     background: #40312b;  
  }
  .van-field{
    background: #40312b;
  }
  /deep/ .van-cell__title {
    color: #fff;
  }
  /deep/ .van-tabs__line {
    background-color: #e56a17;
  }
  /deep/ .van-tabs {
    width: 100%;
  }
  /deep/ .van-tab {
    color: #e56a17;
  }
  .van-tabs__nav {
    width: 100%;
  }
  .button {
    width: 80%;
    height: 40px;
    border-radius: 5px;
    text-align: center;
    color: #ffffff;
    margin:130px auto;
    font-size: 18px;
    line-height: 40px;
    background: #FBA318;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/receipt-manage/add.vue