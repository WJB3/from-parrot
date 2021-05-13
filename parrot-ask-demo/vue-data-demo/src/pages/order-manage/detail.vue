<template>
  <div class="home">
    <van-nav-bar
      :title="isDisabled?'详情':'编辑'"
      left-arrow
      :right-text="isDisabled?'编辑':''"
      @click-left="go('order')"
      @click-right="change()"
    ></van-nav-bar>
    <div class="card">
      <van-cell-group>
        <!-- <van-field
          v-model="temp.aaa"
          clearable
          label="业务经理"
          :placeholder="isDisabled?'':'请输入业务经理'"
          :readonly="isDisabled"
        />
        <van-field
          v-model="temp.phone"
          clearable
          label="客户号码"
          :placeholder="isDisabled?'':'请输入客户号码'"
          @blur="change1()"
          :readonly="isDisabled"
        />
        <van-field
          v-model="temp.name"
          clearable
          label="客户姓名"
          :placeholder="isDisabled?'':'请输入客户姓名'"
          :readonly="isDisabled"
        /> -->
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
        </div>-->
        <van-field
          v-model="temp.sign_money"
          label="签单金额"
          :placeholder="isDisabled?'':'请输入签单金额'"
          :readonly="isDisabled"
        />
        <van-field
          v-model="temp.sign_time"
          label="签单日期"
          :placeholder="isDisabled?'':'请输入签单日期'"
          :readonly="isDisabled"
        />
        <van-field
          v-model="temp.credit_time"
          label="放款日期"
          :placeholder="isDisabled?'':'请输入放款日期'"
          :readonly="isDisabled"
        />
        <van-field
          v-model="temp.credit_money"
          label="放款金额"
          :placeholder="isDisabled?'':'请输入放款金额'"
          :readonly="isDisabled"
        />
        <van-field v-model="temp.income" label="业绩收入" :placeholder="isDisabled?'':'请输入业绩收入'" :readonly="isDisabled" />
        <van-field
          v-model="temp.sign_points"
          label="签单点数"
         :placeholder="isDisabled?'':'请输入签单点数'"   
          :readonly="isDisabled"
        />
        <van-field v-model="temp.remarks" label="备注" :placeholder="isDisabled?'':'请输入备注'" :readonly="isDisabled" />
      </van-cell-group>
    </div>
    <button class="button" @click="del()">{{isDisabled?"删除":"确定"}}</button>
  </div>
</template>

<script>
import Vue from "vue";
import { initSign, delSign ,editSign} from "@/api/index";
import axios from "axios";
import { Dialog } from 'vant';
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";

export default {
  data() {
    return {
      isDisabled: true,
      temp: {},
      arr: [1, 2, 3]
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    change() {
      this.isDisabled = false;
    },
    del() {
      if (this.isDisabled == true) {
        Dialog.confirm({
        message: "是否删除"
      })
        .then(() => {
             delSign({ id: this.$route.params.id }).then(res => {
          this.$router.push({ name: "order" });
        });
        })
        .catch(() => {
        });
      } else {
        this.temp.id=this.$route.params.id;
        editSign(this.temp).then(res => {
          this.isDisabled=true;
        });
      }
    },
    go(res, id) {
      this.$router.push({ name: res, params: { id: id } });
    },
    getList() {
      initSign({ id: this.$route.params.id }).then(res => {
        this.temp = res.result.data;
        //  this.$router.push({ name: res });
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
    font-size: 13px;
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
          font-size: 10px;
        }
      }
      border-bottom: 1px solid #c1c1c1;
    }
  }
  font-size: 14px;
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
// src/pages/order-manage/detail.vue