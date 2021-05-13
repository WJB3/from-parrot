<template>
  <div class="home">
    <van-nav-bar
      title="详情"
      left-arrow
      @click-left="go('client')"
      right-text="编辑"
      @click-right="go('client-add',false)"
    ></van-nav-bar>
    <div class="card">
      <van-cell-group>
        <van-field v-model="temp.name" label="客户姓名" placeholder readonly="readonly" />
        <van-field v-model="temp.phone" label="手机号码" placeholder readonly="readonly" />
        <van-field v-model="temp.remarks" label="填写备注" placeholder readonly="readonly" />
        <van-field v-model="temp.visit_time" label="来访时间" placeholder readonly="readonly" />
        <van-field v-model="category" label="分类详情" placeholder readonly="readonly" />
      </van-cell-group>
    </div>
    <button class="button" @click="del()">删除</button>
  </div>
</template>

<script>
import Vue from "vue";
import { initCustomer, delCustomer, newCustomerList } from "@/api/index";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";
export default {
  data() {
    return {
      category:'',
      showFirst: true,
      show: false,
      option1: [],
      temp: {},
      arr: [1, 2, 3],
      slides: [1, 2, 3]
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    del() {
      delCustomer({ id: this.$route.params.id }).then(res => {
        this.$router.push({ name: "client" });
      });
    },
    getList() {
      initCustomer({ id: this.$route.params.id }).then(res => {
        this.temp = res.result.info;
        res.result.categoryInfo.forEach(resp=>{
          if(resp.id==res.result.info.category_id){
            this.category=resp.cate_name;
          }
        })
      });
    },
    go(res, params) {
      this.$router.push({
        name: res,
        params: { statue: params, id: this.$route.params.id }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  .button {
    width: 76%;
    height: 0.7rem;
    background: #eba436;
    border-radius: 0.3rem;
    border: none;
    color: white;
    font-size: 14px;
    display: block;
    margin: 0 auto;
    margin-top: 1rem;
  }
  .card {
    margin: 20px auto;
    width: 90%;
    background: white;
    border-radius: 0.3rem;
    overflow: hidden;
  }
  .van-nav-bar {
    width: 100%;
  }
  font-size: 12.5px;
  [class*="van-hairline"]::after {
    border: 0;
  }
  .van-nav-bar {
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
// src/pages/client/detail.vue