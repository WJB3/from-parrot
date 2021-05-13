<template>
  <div class="home">
    <Tabbar title="我的团队" leftArrow="true" rightText="团队明细" goUrl="teamDetail"/>
    <div class="header">
      <div>0</div>
      <div>服务器总人数</div>
    </div>
    <div class="title">
      <div>
        <p>131313</p>
        <p>直推会员</p>
      </div>
      <div>
        <p>1231</p>
        <p>团队人数</p>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div>有效：0</div>
        <div>待激活：0</div>
        <div>无效：0</div>
      </div>
      <div class="left">
        <div>有效：0</div>
        <div>待激活：0</div>
        <div>无效：0</div>
      </div>
    </div>
    <div class="content1">
      <div class="header">
        <div>0</div>
        <div>上月有效会员</div>
      </div>
      <div class="bottom">
        <div>直推：0</div>
        <div>分享：0</div>
      </div>
    </div>
    <div class="content1">
      <div class="header">
        <div>0</div>
        <div>本月新增有效会员</div>
      </div>
      <div class="bottom">
        <div>直推：0</div>
        <div>分享：0</div>
      </div>
    </div>
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
  .header {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 55px;
    color: black;
    background: #ffeee7;
  }
  .content1{
    margin: 0 auto;
    width: 90%;
    border-bottom: 1px solid #fff;
    .bottom{
      display: flex;
      justify-content: space-around;
      div{
        margin: 15px;
      }
    }
    .header {
      margin-top: 8px;
      width: 100%;
      display: flex;
      flex-direction: column;
      background: #40312b;
      color: #fff;
      div:first-child{
      color: #f26218;
      }
      justify-content: space-around;
      align-items: center;
      height: 55px;
    }
  }
  .content {
    margin: 0 auto;
    width: 90%;
    display: flex;
    border-bottom: 1px solid #fff;
    .header {
      width: 100%;
      display: flex;
      flex-direction: column;
      background: #40312b;
      color: #fff;
      div:first-child{
      color: #f26218;
      }
      justify-content: space-around;
      align-items: center;
      height: 55px;
    }
    .left {
      width: 50%;
      display: flex;
      flex-wrap: wrap;
      div {
        width: 50%;
        margin-bottom: 20px;
      }
    }
  }
  .title {
    display: flex;
    border-radius: 20px;
    width: 100%;
    height: 100px;
    margin-bottom: 10px;
    div {
      &:first-child {
        border-right: 1px solid #ccc;
      }
      width: 50%;
      height: 70%;
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        &:first-child {
          color: #f26218;
          font-size: 20px;
        }
        margin-top: 15px;
        font-size: 15px;
      }
    }
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/team/index.vue