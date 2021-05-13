<template>
  <div class="home">
    <van-nav-bar
      :title="(active==1&&'未拨打')||(active==2&&'无需跟进')||(active==3&&'待处理')"
      left-arrow
      @click-left="go('home')"
      :right-text="active==2?'批量删除':''"
      @click-right="isDel=!isDel"
    ></van-nav-bar>
    <div class="banner">
      <div class="content" @click="change(1)">
        <div>{{total1}}</div>
        <div>未拨打</div>
      </div>
      <div class="content" @click="change(2)">
        <div>{{total2}}</div>
        <div>无需跟进</div>
      </div>
      <div class="content" style="border:none" @click="change(3)">
        <div>{{total3}}</div>
        <div>待处理</div>
      </div>
    </div>
    <van-swipe indicator-color="white" v-if="active==1" @change="change3">
      <van-swipe-item v-for="(item,index) in arr" :key="index">
        <div class="warp">
          <div class="content">
            <div class="header">
              <div>{{item.name}}</div>
              <a :href="'tel:'+item.phone" @click="iphone(item.id)">{{item.phone}}</a>
              <!-- <div>{{item.phone}}</div> -->
            </div>
            <div class="buttom">
              <div class="row" @click="isShow1=!isShow1">
                <div class="left">
                  <img
                    src="@/assets/images/handle/11.1.png"
                    alt
                    style="width:15px"
                    v-if="isShow1"
                  />
                  <img
                    src="@/assets/images/handle/11.2.png"
                    alt
                    style="width:15px"
                    v-if="!isShow1"
                  />
                </div>
                <div>无需再跟进</div>
              </div>
              <div class="row" @click="isShow1=!isShow1">
                <div class="left">
                  <img
                    src="@/assets/images/handle/11.1.png"
                    alt
                    style="width:15px"
                    v-if="!isShow1"
                  />
                  <img
                    src="@/assets/images/handle/11.2.png"
                    alt
                    style="width:15px"
                    v-if="isShow1"
                  />
                </div>
                <div>待进一步处理</div>
              </div>
              <input
                type="text"
                class="input"
                placeholder="请填写情况备注"
                v-model="item.deal_remarks"
                @blur="change4(item)"
              />
            </div>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <div
      class="card"
      v-if="active==2||active==3"
      v-for="(item,index) in temp"
      :key="index"
      @click="change2(item.id)"
    >
      <div class="left" v-if="isDel">
        <img src="@/assets/images/handle/11.1.png" alt style="width:15px" v-if="isShow" />
        <img src="@/assets/images/handle/11.2.png" alt style="width:15px" v-if="!isShow" />
      </div>
      <div>
        <div class="header">{{item.name}}</div>
        <div class="content">
          <div class="phone">{{item.phone}}</div>
          <div class="time van-ellipsis">{{item.deal_remarks}}</div>
        </div>
      </div>
    </div>
    <button class="button" v-if="isDel" @click="del()">删除</button>
    <button class="button" v-if="active==1" @click="submit()">提交</button>
    <van-pagination
      v-if="active==2||active==3"
      @change="changePage()"
      v-model="currentPage"
      :page-count="Math.ceil(total/8)"
      mode="simple"
    />
  </div>
</template>

<script>
import Vue from "vue";
import Swiper from "swiper";
import {
  noneedFollow,
  waitDialTasks,
  nextDealTasks,
  nextDealDetail,
  batchDelNoneed,
  waitDialSub,
  dialPhone
} from "@/api/index";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";
export default {
  data() {
    return {
      currentPage: 1,
      search: {
        receive_id: "",
        type: "",
        deal_remarks: "",
        currentPage: ""
      },
      isShow2: true,
      isShow1: true,
      total1: "",
      total2: "",
      total3: "",
      active: "",
      isDel: false,
      isShow: false,
      arr: [],
      slides: [1, 2, 3],
      temp: [],
      total: ""
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    var gallerySwiper = new Swiper(".swiper-container", {
      effect: "coverflow"
      // spaceBetween: 10, //缩略图间距
      // slidesPerView: 2,
      // centeredSlides: true,
      // initialSlide: 2,
    });
  },
  methods: {
    iphone(id){
      dialPhone({receive_id:id}).then(res=>{

      })
    },
    changePage() {
      this.get1(this.currentPage);
    },
    change3(index) {
      // if(index%8 === 0){
      //   this.currentPage+=1;
      //   this.get3(this.currentPage)
      // }
      this.search.receive_id = this.arr[index].id;
      // this.search.deal_remarks=this.arr[index].deal_remarks;
    },
    change4(item) {
      this.search.deal_remarks = item.deal_remarks;
    },
    submit() {
      if (this.isShow1 == false) {
        this.search.type = 0;
      } else if (this.isShow1 == true) {
        this.search.type = 1;
      }
      waitDialSub(this.search).then(res => {
        this.getList();
      });
    },
    get1(page) {
      noneedFollow({ pageindex: page, pagesize: 8 }).then(res => {
        this.temp = res.result.data;
        this.total = res.result.total;
      });
    },
    get2(page) {
      nextDealTasks({ pageindex: page, pagesize: 8 }).then(res => {
        this.temp = res.result.data;
        this.total = res.result.total;
      });
    },
    get3(page){
       waitDialTasks({ pageindex: page, pagesize: 10000 }).then(res => {
          this.arr = res.result.data;
          this.search.receive_id = this.arr[0].id;
        });
    },
    change(val) {
      this.active = val;
      if (this.active == 1) {
        this.get3(this.currentPage);
      } else if (this.active == 2) {
        this.get1(this.currentPage)
      } else if (this.active == 3) {
        this.isDel = false;
        this.get2(this.currentPage)
      }
    },
    change1(val) {
      this.isDel = !this.isDel;
    },
    del() {
      // batchDelNoneed({ids:}).then(res=>{
      // })
    },
    change2(id) {
      // if()
      if (this.active == 2) {
        this.isShow = !this.isShow;
      } else if (this.active == 3) {
        this.go("handle-detail", id);
      }
    },
    getList() {
      this.change(1);
      this.active = 1;
      Promise.all([waitDialTasks(), noneedFollow(), nextDealTasks()]).then(
        res => {
          this.total1 = res[0].result.total;
          this.total2 = res[1].result.total;
          this.total3 = res[2].result.total;
        }
      );
    },
    go(res, params) {
      this.$router.push({ name: res, params: { id: params } });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  @deep: ~">>>";
  position: relative;
  @{deep}.van-pagination {
    width: 100%;
    height: 40px;
    background: white;
    bottom: 0;
    position: fixed;
  }
  .van-swipe {
    height: 400px;
    background: #ccc;
    .warp {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      .content {
        overflow: hidden;
        width: 80%;
        height: 342px;
        background: #ffffff;
        border-radius: 8px;
        .header {
          height: 40%;
          width: 100%;
          background: #ffede0;
          display: flex;
          flex-direction: column;
          align-items: center;
          div,
          a {
            margin: 20px auto;
            font-size: 17px;
          }
        }
        .buttom {
          padding-top: 20px;
          .row {
            width: 80%;
            height: 30px;
            display: flex;
            margin: 10px auto;
            .left {
              margin: 0 10px;
            }
          }
          .input {
            width: 80%;
            height: 30px;
            border: 1px solid #ccc;
            border-radius: 50px;
            display: block;
            margin: 10px auto;
          }
        }
      }
    }
  }
  .button {
    width: 76%;
    height: 0.7rem;
    background: #eba436;
    border-radius: 0.3rem;
    border: none;
    color: white;
    font-size: 16px;
    display: block;
    margin: 0 auto;
    margin-top: 2rem;
  }
  .card {
    .left {
      width: 15px;
      height: 15px;
      // background-position: center;
      margin: 10px 10px;
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
        width: 60px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipse;
        margin-left: 150px;
        color: #c1c1c1;
      }
    }
    border-bottom: 1px solid #c1c1c1;
  }
  .van-nav-bar {
    width: 100%;
  }
  .banner {
    display: flex;
    .content {
      div {
        font-size: 14px;
        margin-top: 5px;
      }
      box-sizing: border-box;
      text-align: center;
      color: #f8f8f8;
      margin: 10px 0;
      width: 33.3%;
      border-right: 0.02rem solid #f8f8f8;
    }
    width: 100%;
    height: 60px;
    background: url("~@/assets/images/handle/1.png");
  }
  .button {
    width: 76%;
    height: 0.7rem;
    background: #eba436;
    border-radius: 0.3rem;
    border: none;
    color: white;
    font-size: 16px;
    display: block;
    margin: 0 auto;
    margin-top: 1rem;
  }
  font-size: 14px;
  [class*="van-hairline"]::after {
    border: 0;
  }
  .van-nav-bar {
    background: #f8f8f8;
  }
  .van-nav-bar__title {
    color: black;
  }
  .van-nav-bar__text {
    color: #eba436;
  }
  .van-nav-bar .van-icon {
    color: black;
  }
  .van-cell__title {
    margin-left: 0.7rem;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/handle/unproess.vue