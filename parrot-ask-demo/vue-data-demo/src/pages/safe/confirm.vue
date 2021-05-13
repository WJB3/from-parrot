<template>
  <div class="home">
    <Tabbar title="实名认证" :leftArrow="true" />
    <div class="card">
      <div style="margin-left:8px;margin-top:12px">
        身份证：
      </div>
      <input type="text" placeholder="请输入密码">
    </div>
    <div class="card">
      <div style="margin-left:8px;margin-top:12px">
        真实姓名：
      </div>
      <input type="text" placeholder="请输入新密码">
    </div>
    <button class="submit">确认修改</button>
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

    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.home {
  margin-bottom: 50px;
  font-size: 14px;
  color: white;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  min-height: 667px;
  // background: #40312B;
  .van-cell{
      width: 96%;
      color:#333333;
      // color: white;
      // background: #40312B;
  }
  .submit{
    border: none;
    background: #FBA318;
    display: block;
     border-radius: 4px;
    margin: 100px auto;
    width: 90%;
    height: 40px;
  }
  .card:nth-child(0){
     background: red; 
     margin-top: 32px;
  }
  .card{
    input{
      margin-left: 10px;
      width: 60%;
      background: #40312B;
    }
    .button{
      &:hover{
        cursor:pointer
      }
      width: 100px;
      height: 35px;
      background: #FBA318;
      border-radius: 4px;
      text-align: center;
      line-height: 35px;
    }
    display: flex;
    margin: 15px auto;
    width: 90%;
    height: 35px;
    border: 1px solid #AAA4A2;
    border-radius: 4px; 
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/safe/confirm.vue