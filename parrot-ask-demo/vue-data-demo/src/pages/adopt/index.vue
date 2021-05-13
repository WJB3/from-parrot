<template>
  <div class="home">
    <Tabbar title="购买记录" :leftArrow="true" @click="goMy()" />
    <van-tabs v-model="active" background="#FFEEE7" @change="change">
      <van-tab :title="item" v-for="(item,index1) in arr1" :key="index1">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div
            class="card"
            v-for="(item,index) in arr"
            :key="index"
            @click="go('adopt-detail',item)"
          >
            <div style="margin-top:20px">
              <img :src="item.image" class="image" />
            </div>
            <div class="right">
              <div class="top">
                <span style="color:#FBA318">{{item.name}}</span>
              </div>
              <div>价值：{{item.price}}</div>
              <div>购买时间：{{item1==1?item.adopt_time:item.addtime}}</div>
              <div>预约/即抢购买消耗羽毛：{{item.appoint}}/{{item.purchase}}</div>
              <div>智能合约收益：{{item.day}}天/{{(item.day*item.bonus_rate*100).toFixed(0)}}%</div>
              <div>可挖HKT：{{item.coin_hkt}}</div>
              <div>可挖PHD：{{item.coin_phd}}枚</div>
              <div class="button profitBtn" v-if="index1==1">收益中</div>
              <div
                class="button"
                v-if="index1==2"
              >{{(item.status==6&&"自动确认")||(item.status==7&&"订单冻结")||(item.status==3&&"申诉中")||(item.status==8&&"已取消")||(item.status==4&&"申诉通过")||(item.status==5&&"申诉失败")}}</div>
              <div class="button" v-if="item.status==1">待确认</div>
              <div class="buttons" v-if="index1==0&&item.status!==1">
                <div class="confirm" @click="go('adopt-detail',item)">付款</div>
                <!-- <div class="cancel" @click="cancel(item.id)">取消</div> -->
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Vue from "vue";
import { Adoption, pets, cancelOrder, feed } from "@/api/home";
import { Toast } from "vant";
import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {},
  data() {
    return {
      id: 1,
      pageindex: 1,
      loading: false,
      finished: false,
      arr1: ["购买中", "已购买", "取消/申诉"],
      arr: [],
      item1: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    feed(id) {
      feed({ id: id }).then(res => {});
    },
    cancel(id) {
      cancelOrder({ id: id }).then(res => {
        Toast("已取消");
        this.getList(1);
      });
    },
    onLoad() {
      Adoption({ type: this.id, pageindex: this.pageindex, pagesize: 10 }).then(
        resp => {
          this.loading = false;
          this.pageindex++;
          if (resp.data.length == 0) {
            this.finished = true;
            return;
          }
          this.arr = this.arr.concat(resp.data);
          // this.arr=res.data;
        }
      );
    },
    getList(id) {
      Adoption({ type: id, pageindex: 1, pagesize: 10 }).then(res => {
        this.arr = res.data;
      });
    },
    change(item) {
      this.arr = [];
      this.item1 = item;
      if (item == 0) {
        this.getList(1);
      } else if (item == 2) {
        this.getList(2);
      } else {
        this.id = "";
        pets({ pageindex: 1, pagesize: 10 }).then(res => {
          this.arr = res.data;
        });
      }
    },
    go(res, item) {
      localStorage.setItem("detail", JSON.stringify(item));
      if (this.id == "") {
      } else {
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
  font-size: 12px;
  color: white;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  min-height: 640px;
  padding-bottom: 10px;
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
  .card {
    padding-bottom: 10px;
    overflow: hidden;
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
        padding: 0 10px;
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
        font-size: 16px;
        width: 148px;
        text-align: center;
        line-height: 30px;
        height: 30px;
        background: #e56a17;
        border-radius: 20px;
      }
      .profitBtn {
        background: #fba318;
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
      width: 95px;
      height: 3rem;
      object-fit: contain;
      display: inline-block;
    }
    display: flex;
    justify-content: flex-start;
    margin: 12px auto;
    &:last-child {
      margin-bottom: 40px;
    }
    width: 330px;
    height: 205px;
    background: rgba(66, 66, 66, 0.7);
    border-radius: 8px;
    // background: url("~@/assets/images/home/card.png");
    // background-size: 100% 100%;
    // background-position:center;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/adopt/index.vue