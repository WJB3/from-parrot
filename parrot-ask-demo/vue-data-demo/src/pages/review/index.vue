<template>
  <div class="home">
    <van-nav-bar title="回访计划" left-arrow @click-left="go('home')"></van-nav-bar>
    <div class="card" v-for="(item,index) in temp" :key="index" @click="go('reviewdetail',item.id)">
      <div>
        <div class="header">{{item.name}}</div>
        <div class="content">
          <div class="phone">{{item.phone}}</div>
          <div class="time van-ellipsis">{{item.deal_remarks}}</div>
        </div>
      </div>
      <div class="right" @click.stop="tran(item.id)" v-if="item.is_customer==0">{{item.is_customer==0?'转入客户':'删除'}}</div>
    </div>
       <van-pagination @change="changePage()" v-model="currentPage" :page-count="Math.ceil(total/10)" mode="simple" />
  </div>
</template>
<script>
import Vue from "vue";
import { Dialog } from 'vant';
import Swiper from "swiper";
import { returnVisitPlan,dealVisitPlan} from "@/api/index";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";
export default {
  data() {
    return {
      temp: [],
      currentPage:'',
    };
  },
  created() {
    this.getList();
  },
  mounted() {
  },
  methods: {
    changePage(){
       this.getList(this.currentPage);
    },
    tran(id) {
      Dialog.confirm({
        message: "是否转入客户列表"
      })
        .then(() => {
            dealVisitPlan({receive_id:id,type:0}).then(res=>{
                this.getList()
            })
        })
        .catch(() => {
           dealVisitPlan({receive_id:id,type:1}).then(res=>{
                  
            })
        });
    },

    getList(page) {
        returnVisitPlan({pageindex:page,pagesize:8}).then(res=>{
           this.temp=res.result.data;
           this.total = res.result.total;
        })
    },
    go(res,id) {
      console.log(res);
      this.$router.push({ name: res ,params:{id:id}});
    }
  }
};
</script>

<style lang="less" scoped>
.home {
   @deep: ~">>>";
  position: relative;
  @{deep}.van-pagination{
    width: 100%;
    height: 40px;
    background: white;
    bottom: 0;
    position: fixed;
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
    margin-top: 2rem;
  }
  .card {
    // line-height:
    .right {
      margin-top: 10px;
      width: 60px;
      height: 22px;
      font-size: 14px;
      text-align: center;
      color: #eba436;
      border: #eba436 1px solid;
      line-height: 22px;
      border-radius: 3px;
    }
    display: flex;
    margin: 0.2rem 0.3rem;
    .header {
      margin-bottom: 0.2rem;
    }
    .content {
      margin-bottom: 0.2rem;
      display: flex;
      justify-content: space-between;
      .time {
        width: 120px;
        white-space: nowrap;
        overflow: hidden;
        font-size: 14px;
        text-overflow: ellipse;
        margin-left: 20px;
        margin-right: 0px;
        color: #c1c1c1;
      }
    }
    border-bottom: 1px solid #c1c1c1;
  }
  .van-nav-bar {
    width: 100%;
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
    margin-top: 2rem;
  }
  font-size: 17px;
  [class*="van-hairline"]::after {
    border: 0;
  }
  .van-nav-bar {
    background: #eba436;
  }
  .van-nav-bar__title {
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
// src/pages/review/index.vue