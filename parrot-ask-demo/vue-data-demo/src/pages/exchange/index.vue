<template>
  <div class="home">
    <Tabbar title="兑换列表" :leftArrow="true" rightText="兑换记录" goUrl="exchangeRecord" />
    <ul class="goods-list">
      <li v-for="(item,index) in arr" :key="index">
        <div class="pet-img">
          <img :src="item.image" class="image" />
        </div>
        <div class="content-chunk">
          <div class="top">
            <span>{{item.name}}</span>
          </div>
          <div>价值：<span class="rightEl">{{item.start_price}}-{{item.end_price}}</span></div>
          <div>购买时间：<span class="rightEl">{{item.start_time.split(':')[0]}}:{{item.start_time.split(':')[1]}}-{{item.end_time.split(':')[0]}}:{{item.end_time.split(':')[1]}}</span></div>
          <div>预约/即抢羽毛：<span class="rightEl">{{item.appoint}}/{{item.purchase}}</span></div>
          <div>智能合约收益：<span class="rightEl">{{item.day}}天/{{(item.day*item.bonus_rate*100).toFixed(0)}}%</span></div>
          <div>可挖HKT：<span class="rightEl">{{item.coin_hkt}}枚</span></div>
          <div>可挖PHD：<span class="rightEl">{{item.coin_phd}}枚</span></div>
        </div>
        <button class="button" @click="exchange(item)">兑换</button>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
// bannerList
import { getList,convert } from "@/api/exchange";
// import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  data() {
    return {
      arr1: [],
      arr: []
    };
  },
  created() {
    this.initList();
  },
  mounted() {},
  methods: {
    initList() {
      getList().then(res => {
        this.arr = res;
      });
    },
    exchange(item) {
      convert(item.id).then(res => {
        Toast.loading({
          mask: true,
          message: res.msg
        });
        this.initList();
      }).catch(err=>{});
    },
  }
};
</script>

<style lang="less" scoped>
.home {
  font-size: 12px;
  color: white;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  padding-bottom: 30px;
  min-height: 640px;
  .van-swipe {
    width: 100%;
    height: 150px;
  }
  .home_banner {
    margin: 3%;
  }
  .goods-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 2%;
    text-align: center;
    li {
      width: 49%;
      // background-color: #312f31;
      background: #fff;
      color: #333;
      margin-top: 10px;
      border-radius: 8px;
      .content-chunk {
        text-align: left;
        padding: 0 3px;
      }
      .pet-img {
        text-align: center;
        img {
          width: 64px;
          height: 49px;
        }
      }
      .image {
        width: 115px;
        display: inline-block;
      }
      .button {
        font-size: 16px;
        width: 148px;
        margin-top: 12px;
        margin-bottom: 20px;
        text-align: center;
        line-height: 30px;
        height: 30px;
        background: #ec6941;
        border: none;
        border-radius: 20px;
        color: #fff;
      }
      .content-chunk {
        margin-top: 25px;
      }
      div {
        margin-top: 10px;
      }
      .top {
        margin-top: 20px;
        font-size: 16px;
        color: #ec6941;
      }
    }
  }
  .rightEl{
    font-weight: 550;
    float:right;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/exchange/index.vue