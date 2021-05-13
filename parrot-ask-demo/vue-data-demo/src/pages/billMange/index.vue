<template>
  <div class="home">
    <Tabbar title="账单流水" :leftArrow="true" />
    <van-tabs v-model="active" @click="sel">
      <van-tab title="收入" name="1">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
          <div v-show="artNum==0">
            <div class="coupon3">
              <!-- <img src="../../assets/img/null.png" alt class="nullImg" /> -->
              <p>暂无内容</p>
            </div>
          </div>
          <ul class="order-content main">
            <li v-for="(item,index) in list" :key="index" class="card">
              <div class="content">
                <div class="phone">{{item.currency_name}}</div>
                <div class="time" style="color:#FD5202">{{item.account}}</div>
              </div>
              <div class="content">
                <div class="phone">{{item.bill_type}}</div>
                <div class="time">{{item.create_time}}</div>
              </div>
            </li>
          </ul>
        </van-list>
      </van-tab>
      <van-tab title="支出" name="2">
        <van-list v-model="loadin" :finished="finish" finished-text="没有更多了" @load="Load">
          <div v-show="art==0">
            <div class="coupon3">
              <!-- <img src="../../assets/img/null.png" alt class="nullImg" /> -->
              <p>暂无内容</p>
            </div>
          </div>
          <ul class="order-content main">
            <li v-for="(item,itemIndex) in goodsList" :key="itemIndex" class="card">
              <div class="content">
                <div class="phone">{{item.currency_name}}</div>
                <div class="time" style="color:#FD5202">{{item.account}}</div>
              </div>
              <div class="content">
                <div class="phone">{{item.bill_type}}</div>
                <div class="time">{{item.create_time}}</div>
              </div>
            </li>
          </ul>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { inRecord, outRecord } from "@/api/home";
import { Notify } from "vant";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    this.onLoad();
  },
  data() {
    return {
      loading: false,
      finished: false,
      artNum: 0,
      temp: {
        page: 1,
        pagesize: 10
      },
      list: [],
      loadin: false,
      finish: false,
      art: 0,
      info: {
        page: 1,
        pagesize: 10
      },
      goodsList: [],
      active: 1
    };
  },
  methods: {
    onLoad() {
      this.$toast.loading("加载中...");
      setTimeout(() => {
        inRecord(this.temp.page, this.temp.pagesize).then(res => {
          this.$toast.clear();
          this.artNum = Math.ceil(res.count / this.temp.pagesize);
          this.list = this.list.concat(res.data);
          this.loading = false;
          if (this.temp.page >= this.artNum) {
            this.finished = true;
            return;
          }
          this.temp.page++;
        });
      }, 500);
    },
    // 支出
    Load() {
      this.$toast.loading("加载中...");
      setTimeout(() => {
        outRecord(this.info.page, this.info.pagesize).then(res => {
          this.$toast.clear();
          this.art = res.count / 1;
          this.goodsList = this.goodsList.concat(res.data);
          this.loadin = false;
          if (this.goodsList.length >= this.art) {
            this.finish = true;
            return;
          }
          this.info.page++;
        });
      }, 500);
    },
    sel(name) {
      if (name == 2) {
        this.goodsList = [];
        this.info.page = 1;
        this.art = 0;
        this.initializat();
      } else {
        this.list = [];
        this.temp.page = 1;
        this.artNum = 0;
        this.initialization();
      }
    },
    //  收入控制切换
    initialization() {
      this.loading = true; //下拉加载中
      this.finished = false; //下拉结束
      if (this.loading) {
        this.onLoad();
      }
    },
    //  支出控制切换
    initializat() {
      this.loadin = true; //下拉加载中
      this.finish = false; //下拉结束
      if (this.loadin) {
        this.Load();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.home {
  font-size: 14px;
  color:#c1c1c1;
  min-height: 640px;
  .main {
    border-radius: 5px;
    background: #fff;
    li {
      background-color: #fff;
      padding: 7px 0 3px;
      margin: 10px 0px;
    }
    div {
      width: 65%;
      display: inline-block;
      vertical-align: top;
      margin-left: 15px;
      margin-top: 5px;
      color: #c1c1c1;
    }
    .card {
      font-size: 16px;
      margin: 0.2rem 0.3rem;
      .header {
        margin-bottom: 0.2rem;
      }
      .content {
        margin-bottom: 0.2rem;
        display: flex;
        justify-content: space-between;
        width: 100%;
        color: #c1c1c1;
        .time {
          width: 100%;
        }
      }
      border-bottom: 1px solid #c1c1c1;
    }

    .nullImg {
      width: 202px;
      height: 180px;
    }
  }
  .coupon3 p {
    text-align: center;
    font-size: 20px;
    margin-top: 30px;
  }
  .van-tab--active {
    color: #333;
  }
  .van-tabs__line {
    background-color: #f44;
  }
}
</style>






// WEBPACK FOOTER //
// src/pages/billMange/index.vue