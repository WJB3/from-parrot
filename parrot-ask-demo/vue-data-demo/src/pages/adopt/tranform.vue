<template>
  <div class="home">
    <Tabbar title="转让记录" :leftArrow="true" @click="goMy()" />
    <van-tabs v-model="active" background="#FFEEE7" @change="change">
      <van-tab :title="item" v-for="(item,index1) in arr1" :key="index1">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div
            class="card"
            v-for="(item,index) in arr"
            :key="index"
            @click="go('adopt-detail',item,index1)"
          >
            <div>
              <img :src="item.image" class="image" />
            </div>
            <div class="right">
              <div class="top">
                <span style="color:#FBA318">{{item.name}}</span>
              </div>
              <div>价值：{{item.price}}</div>
              <div>交易时间：{{id==0?item.intime:item.addtime}}</div>
              <div>预约/即抢购买消耗羽毛：{{item.appoint}}/{{item.purchase}}</div>
              <div>智能合约收益：{{item.day}}天/{{(item.day*item.bonus_rate*100).toFixed(0)}}%</div>
              <div>可挖HKT：{{item.coin_hkt}}</div>
              <div class="button" v-if="index1==1">{{item.status?'待确认':'待付款'}}</div>
              <!-- <div class="button" >{{item.status?'待确认':'待付款'}}</div> -->
            </div>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import { saleList, onSaleList } from "@/api/home";
import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {},
  data() {
    return {
      id: 0,
      pageindex: 1,
      loading: false,
      finished: false,
      arr1: ["待售出", "交易中", "已完成", "取消/申请"],
      arr: []
    };
  },
  created() {
    // onSaleList({pageindex: 1, pagesize: 7 }).then(res => {
    //   this.arr = res.data;
    // });
  },
  mounted() {},
  methods: {
    onLoad() {
      if (this.id == 0) {
        onSaleList({ pageindex: this.pageindex, pagesize: 10 }).then(resp => {
          this.loading = false;
          this.pageindex++;
          if (resp.data.length == 0) {
            this.finished = true;
            return;
          }
          this.arr = this.arr.concat(resp.data);
        });
      } else {
        saleList({
          type: this.id,
          pageindex: this.pageindex,
          pagesize: 10
        }).then(resp => {
          this.loading = false;
          this.pageindex++;
          if (resp.data.length == 0) {
            this.finished = true;
            return;
          }
          this.arr = this.arr.concat(resp.data);
        });
      }
    },
    change(id) {
      this.arr = [];
      this.id = id;
      if (id == 0) {
        onSaleList({ pageindex: 1, pagesize: 10 }).then(res => {
          this.arr = res.data;
        });
      } else {
        this.getList(id);
      }
    },
    getList(id) {
      saleList({ type: id, pageindex: 1, pagesize: 10 }).then(res => {
        this.arr = res.data;
      });
    },
    go(res, item, index1) {
      if (this.id == 0) {
      } else {
        localStorage.setItem("detail", JSON.stringify(item));
        this.$router.push({
          name: res,
          params: {
            id: item.id
          }
        });
      }
    },
    goMy() {
      this.$router.push({ path: "/my" });
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
  /deep/ .van-tabs {
    width: 100%;
  }
  .van-tabs__nav {
    width: 100%;
  }
  .card {
    .right {
      .buttons {
        display: flex;
      }
      .confirm {
        width: 60px;
        text-align: center;
        line-height: 30px;
        height: 30px;
        background: #04e94a;
      }
      .cancel {
        margin-left: 20px;
        width: 60px;
        text-align: center;
        line-height: 30px;
        height: 30px;
        background: #e56a17;
      }
      .button {
        font-size: 18px;
        width: 148px;
        text-align: center;
        line-height: 30px;
        height: 30px;
        background: #e56a17;
        border-radius: 20px;
      }
      div {
        margin-top: 12px;
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
      width: 95px;
      display: inline-block;
    }
    display: flex;
    justify-content: flex-start;
    margin: 12px auto;
    &:last-child {
      margin-bottom: 40px;
    }
    width: 330px;
    padding-bottom: 25px;
    background: rgba(66, 66, 66, 0.7);
    border-radius: 8px;
    // background: url("~@/assets/images/home/card.png");
    // background-size: 100% 100%;
    // background-position:center;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/adopt/tranform.vue