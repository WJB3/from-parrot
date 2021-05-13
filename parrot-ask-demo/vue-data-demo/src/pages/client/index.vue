<template>
  <div class="home">
    <van-nav-bar
      title="客户"
      left-arrow
      right-text="添加"
      @click-right="go('client-add',true)"
      @click-left="go('situation')"
    ></van-nav-bar>
    <div class="c_content">
      <div class="c_left">
        <van-sidebar v-model="activeKey">
          <van-sidebar-item
            :title="item.cate_name"
            @click="onClick(item.id)"
            v-for="(item,index) in arr"
            :key="index"
          />
        </van-sidebar>
      </div>
      <div class="c_right">
        <div
          class="card"
          @click="go('client-detail',item.id)"
          v-for="(item,index) in arr1"
          :key="index"
        >
          <div class="left">
            <div class="header">
              <div class="phone">{{item.name}}</div>
              <div class="time">{{item.phone}}</div>
            </div>
            <div class="content">
              <div class="time">{{item.remarks}}</div>
            </div>
          </div>
          <div class="right">{{item.is_show==0?'来访':''}}</div>
        </div>
      </div>
    </div>

    <van-pagination
      @change="changePage()"
      v-model="currentPage"
      :page-count="Math.ceil(total/10)"
      mode="simple"
    />
  </div>
</template>
<script>
import Vue from "vue";
import { customersList, newCustomerList } from "@/api/index";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";

export default {
  data() {
    return {
      activeKey: 0,
      arr: [],
      arr1:[],
      total: "",
      currentPage: ""
    };
  },
  created() {
    this.getList(1);
  },
  mounted() {},
  methods: {
    onClick(index) {
      console.log(index)
      // this.activeKey = index;
      newCustomerList({ category_id: index, pageindex: 1, pagesize: 10 }).then(
        res => {
          this.arr = res.result.categoryArr;
          this.arr1 = res.result.data;
          this.total = res.result.total;
        }
      );
    },
    changePage() {
      this.getList(this.currentPage);
    },
    getList(page) {
      newCustomerList({ category_id: 0, pageindex: page, pagesize: 100000 }).then(
        res => {
          this.arr = res.result.categoryArr;
          this.arr1 = res.result.data;
          this.total = res.result.total;
        }
      );
    },
    go(res, params) {
      this.$router.push({ name: res, params: { id: params, statue: params } });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  // position: absolute;
  // top:0;
  // left:0;
  // width: 100%;
  .van-sidebar-item--select {
    border-color:#eba436;
  }
  .c_content {
    margin-bottom: 40px;
    display: flex;
    .c_left {
      flex: 1;
    }
    .c_right {
      flex: 6;
    }
  }
  @deep: ~">>>";
  position: relative;
  @{deep}.van-pagination {
    width: 100%;
    height: 40px;
    background: white;
    bottom: 0;
    position: fixed;
  }
  font-size: 14px;
  .card {
    width: 250px;
    .left{
      width:80px;
    }
    .right {
      display: flex;
      align-items: center;
      margin-left: 140px;
      color: #eba436;
      font-size: 13px;
    }
    display: flex;
    margin: 0.2rem ;
    .header {
      width: 150px;
      margin-bottom: 0.2rem;
      display: flex;
      justify-content: space-between;
      .time {
        color: #c1c1c1;
        font-size: 14px;
      }
    }
    .content {
      margin-bottom: 0.2rem;
      display: flex;
      justify-content: space-between;
      .time {
        color: #c1c1c1;
        font-size: 12px;
      }
    }
    border-bottom: 1px solid #c1c1c1;
  }
  [class*="van-hairline"]::after {
    border: 0;
  }
  .van-nav-bar {
    width: 100%;
    background: #eba436;
  }
  .van-nav-bar__title {
    color: #f8f8f8;
  }
  .van-nav-bar__text {
    color: #f8f8f8;
  }
  .van-nav-bar .van-icon {
    color: #f8f8f8;
  }
  .van-cell__title {
    margin-left: 0.7rem;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/client/index.vue