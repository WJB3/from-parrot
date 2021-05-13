<template>
  <div class="home">
    <Tabbar title="我的团队" :leftArrow="true" />
    <div class="title">
      <div @click="change()">
        <p>{{total_direct}}</p>
        <p>直推</p>
      </div>
      <div @click="change1()">
        <p>{{group_person_count}}</p>
        <p>团队</p>
      </div>
    </div>
    <div class="card" v-for="(item,index) in arr" :key="index" @click="go('order-detail',item.id)">
      <div class="content">
        <div class="phone">{{item.nick_name}}</div>
        <div class="time" style="color:#FD5202">{{item.rank_name}}</div>
      </div>
      <div class="content">
        <div class="phone">{{item.member.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")}}</div>
        <div class="time">团队人数：{{item.group_person_count}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { totalInfo, teaminfo } from "@/api/home";
import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    totalInfo().then(res => {
      this.arr = res.totalTeam;
      this.group_person_count = res.group_person_count;
      this.total_direct = res.total_direct;
    });
  },
  data() {
    return {
      group_person_count: "",
      total_direct: "",
      item: {},
      arr1: ["合约收益", "动态收益", "HKT记录"],
      arr: []
    };
  },
  mounted() {},
  methods: {
    change() {
      totalInfo().then(res => {
        this.arr = res.totalTeam;
        this.group_person_count = res.group_person_count;
        this.total_direct = res.total_direct;
      });
    },
    change1() {
      teaminfo().then(res => {
        this.arr = res.totalTeam;
        this.group_person_count = res.group_person_count;
        this.total_direct = res.total_direct;
      });
    }
  }
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
  color: #333333;
  // background: #40312b;
  /deep/ .van-tabs--line .van-tabs__wrap {
    height: 40px;
  }
  .button {
    width: 330px;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    background: #FBA318;
    border-radius: 5px;
    font-size: 16px;
    border: none;
    color: white;
    display: block;
    margin: 0 auto;
    margin-top: 0.5rem;
  }
  .header1 {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 55px;
    color: black;
    background: #ffeee7;
  }
  .content1 {
    color: #ff6531;
    width: 100%;
    height: 150px;
    background: #ffeece;
  }
  .title {
    display: flex;
    width: 100%;
    height: 80px;
    background: #ffeee7;
    margin-bottom: 10px;
    div {
      &:first-child {
        border-right: 1px solid #ccc;
      }
      width: 50%;
      height: 80%;
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        &:first-child {
          color: #f26218;
          font-size: 20px;
        }
        color: #40312b;
        margin-top: 10px;
        font-size: 15px;
      }
    }
  }
  .card {
    margin: 0.2rem 0.3rem;
    .header {
      margin-bottom: 0.2rem;
    }
    .content {
      margin-bottom: 0.2rem;
      display: flex;
      justify-content: space-between;
      .time {
        color: #333333;
      }
    }
    border-bottom: 1px solid #c1c1c1;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/team/detail.vue