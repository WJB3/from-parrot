<template>
  <div class="home">
    <Tabbar title="预约记录" :leftArrow="true" />
    <!-- <img src="@/assets/images/home/banner.png" width="100%"> -->
    <div class="card" v-for="(item,index) in arr" :key="index">
      <div>
        <img :src="item.image" class="image" />
      </div>
      <div class="right">
        <div class="top">
          <span style="color:#FBA318">{{item.name}}</span>
        </div>
        <div>价值：{{item.start_price}}-{{item.end_price}}</div>
        <div>购买时间：{{item.create_time}}</div>
        <div>预约/即抢购买消耗羽毛：{{item.appoint}}/{{item.purchase}}</div>
        <div>智能合约收益：{{item.day}}天/{{(item.day*item.bonus_rate*100).toFixed(0)}}%</div>
        <div>可挖HKT：{{item.coin_hkt}}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from "vue";
import { appointList } from "@/api/home";
// import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    // console.log(Tabbar);
  },
  data() {
    return {
      arr: null
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      appointList({ pageindex: 1, pagesize: 10000 }).then(res => {
        this.arr = res.data;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  padding-bottom: 10px;
  font-size: 12px;
  color: white;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  min-height: 640px;
  // background: #41322b;
  img {
    // position: absolute;
    // top:40px;
  }
  .card {
    .right {
      .button {
        width: 148px;
        text-align: center;
        line-height: 30px;
        height: 30px;
        background: #4b8c28;
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
      width: 100px;
      // height: 3rem;
      display: inline-block;
    }
    display: flex;
    justify-content: flex-start;
    margin: 12px auto;
    &:last-child {
      margin-bottom: 40px;
    }
    width: 330px;
    height: 175px;
    background: rgba(66, 66, 66, 0.7);
    border-radius: 8px;
    // background: url("~@/assets/images/home/card.png");
    // background-size: 100% 100%;
    // background-position:center;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/adopt/appointment.vue