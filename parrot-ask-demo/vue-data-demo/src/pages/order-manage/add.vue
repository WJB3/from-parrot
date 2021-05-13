<template>
  <div class="home">
    <van-nav-bar title="添加" left-arrow @click-left="go('order')"></van-nav-bar>
    <div class="card">
      <van-cell-group>
        <van-field v-model="temp.aaa"  clearable label="业务经理" placeholder="请输入业务经理"/>
        <van-field v-model="temp.phone"  clearable label="客户号码" placeholder="请输入客户号码" @blur="change1()"/>
        <van-field v-model="temp.name"  clearable label="客户姓名" placeholder="请输入客户姓名"/>
        <!-- <div class="content">
          <div class="left">客户姓名</div>
          <div class="right">
            <van-dropdown-menu>
              <van-dropdown-item v-model="value1" :options="option1"/>
            </van-dropdown-menu>
          </div>
        </div>
        <div class="content">
          <div class="left">客户号码</div>
          <div class="right">
            <van-dropdown-menu>
              <van-dropdown-item v-model="value1" :options="option1"/>
            </van-dropdown-menu>
          </div>
        </div> -->
        <van-field v-model="temp.sign_money"  label="签单金额" placeholder="请输入签单金额" />
        <van-field v-model="temp.sign_time"  label="签单日期" placeholder="请输入签单日期" />
        <van-field v-model="temp.credit_time"  label="放款日期" placeholder="请输入放款日期" />
        <van-field v-model="temp.credit_money"  label="放款金额" placeholder="请输入放款金额" />
        <van-field v-model="temp.income"  label="业绩收入" placeholder="请输入业绩收入" />
        <van-field v-model="temp.sign_points"  label="签单点数" placeholder="请输入签单点数" />
        <van-field v-model="temp.remarks"  label="备注" placeholder="请输入备注" />
      </van-cell-group>
    </div>
    <button class="button" @click="submit()">确定</button>
  </div>
</template>

<script>
import Vue from "vue";

import { checkSeller,addSign} from "@/api/index";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";

export default {
  data() {
    return {
      temp:{},
      isShow: false,
      isShow1: false,
      value1: 0,
      value2: "a",
      option1: [
        { text: "全部商品", value: 0 },
        { text: "新款商品", value: 1 },
        { text: "活动商品", value: 2 }
      ]
    };
  },
   created() {
    this.getList();
  },
  mounted() {},
  methods: {
    submit() {
      addSign(this.temp).then(res => {
        this.$router.push({ name: 'order' });
      });
    },
    change1(){
      checkSeller({phone:this.temp.phone}).then(res=>{
        this.$set(this.temp,'name',res.result.data.name)
      })
    },
    change(num) {
      if (num == 1) {
        this.isShow = !this.isShow;
      } else if (num == 2) {
        this.isShow1 = !this.isShow1;
      }
    },
    go(res,id){
          this.$router.push({name:res,params:{id:id}});
      }
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.home {
  font-size: 10.5px;
  .van-dropdown-menu{
    height: 100%;
  }
  @{deep}.van-dropdown-menu__title::after{
    top:0.26rem;
    right: -3rem;
  }
  .content {
    width: 100%;
    height: 0.8rem;
    display: flex;
    line-height: 0.8rem;
    .left {
      margin-left: 0.3rem;
      width: 1.8rem;
    }
  }
  .active {
    position: relative;
  }
  .select {
    width: 5rem;
    height: 7rem;
    margin-top: -0.5rem;
    right: 0.8rem;
    //background: url("~@/assets/images/order/2.png");
    background-position: start;
    z-index: 2;
    position: absolute;
  }
  .span {
    width: 0.2rem;
    margin-top: -0.5rem;
    right: 0.8rem;
    z-index: 1;
    position: absolute;
  }
  .button {
    width: 76%;
    height: 0.7rem;
    background: #eba436;
    border-radius: 0.3rem;
    border: none;
    color: white;
    font-size: 17px;
    display: block;
    margin: 0 auto;
    margin-top: 1rem;
  }
  .card {
    width: 90%;
    margin: 0.3rem auto;
    padding: 0.1rem 0.05rem;
    background: white;
    border-radius: 0.2rem;
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
          color: #c1c1c1;
        }
      }
      border-bottom: 1px solid #c1c1c1;
    }
  }
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
// src/pages/order-manage/add.vue