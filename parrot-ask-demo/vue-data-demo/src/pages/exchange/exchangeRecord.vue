<template>
  <div class="home">
    <Tabbar title="兑换记录" :leftArrow="true"/>
    <ul class="goods-list">
      <li v-for="(item,index) in arr" :key="index">
        <div class="pet-img">
          <img :src="item.image" class="image" />
        </div>
        <div class="content-chunk">   
          <div class="top">
            <span>{{item.name}}</span>
          </div>
          <div>价值：{{item.start_price}}-{{item.end_price}}</div>
          <div>购买时间：{{item.start_time}}-{{item.end_time}}</div>
          <div>预约/即抢购买羽毛：{{item.appoint}}/{{item.purchase}}</div>
          <div>智能合约收益：{{item.day}}天/{{(item.day*item.bonus_rate*100).toFixed(0)}}%</div>
          <div>可挖HKT：{{item.coin_hkt}}枚</div>
          <div>兑换时间：{{item.create_time}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
import { convertRecord } from "@/api/exchange";
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
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      convertRecord().then(res => {
        this.arr = res;
      });
    }
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
      width: 100%;
      background: #fff;
      color: #333;
      margin-top: 10px;
      border-radius: 8px;
      .content-chunk {
        overflow: hidden;
        text-align: left;
        width:80%;
        margin:0 auto;
        padding-bottom:10px;
      }
      .pet-img {
        // height: 60px;
        text-align: center;
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
        background: #4b8c28;
        border: none;
        border-radius: 20px;
        color: #fff;
      }
      div {
        margin-top: 10px;
      }
      .top {
        font-size: 16px;
        color: #ec6941;
      }
    }
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/exchange/exchangeRecord.vue