<template>
  <div class="home">
    <van-nav-bar title="未拨打" left-arrow @click-left="go('order-add')"></van-nav-bar>
    <div class="banner">
      <div class="content">
        <div>666</div>
        <div>未播打</div>
      </div>
      <div class="content">
        <div>666</div>
        <div>未播打</div>
      </div>
      <div class="content" style="border:none">
        <div>666</div>
        <div>未播打</div>
      </div>
    </div>
    <div class="swiper-container">
     <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
    </div>
    </div>
    <button class="button">登录</button>
  </div>
</template>

<script>
import Vue from "vue";
import Swiper from "swiper";
import url from "../../assets/js/api.js";
import axios from "axios";
import { Card, Loading } from "vant";
Vue.component(Card.name, Card);
Vue.component(Loading.name, Loading);
import { Waterfall } from "vant";
export default {
  data() {
    return {
      arr: [1, 2, 3],
      slides:[1,2,3]
    };
  },
  mounted() {
    new Swiper ('.swiper-container', { 
    watchSlidesProgress: true, 
    slidesPerView: 'auto', 
    centeredSlides: true, 
    loop: true, 
    loopedSlides: 5, 
    autoplay: true, 
    navigation: { 
        nextEl: '.swiper-button-next', 
        prevEl: '.swiper-button-prev', 
    }, 
 
    on: { 
        progress: function(progress) { 
            for (i = 0; i < this.slides.length; i++) { 
                var slide = this.slides.eq(i); 
                var slideProgress = this.slides[i].progress; 
 
                if (Math.abs(slideProgress) > 1) { 
                    modify = (Math.abs(slideProgress) - 1) * 0.4 + 1; 
                } 
                translate = slideProgress * modify * 318 + 'px'; 
                scale = 1 - Math.abs(slideProgress) / 5; 
                zIndex = 999 - Math.abs(Math.round(10 * slideProgress)); 
                slide.transform('translateX(' + translate + ') scale(' + scale + ')'); 
                slide.css('zIndex', zIndex); 
                slide.css('opacity', 1); 
                if (Math.abs(slideProgress) > 3) { 
                    slide.css('opacity', 0); 
                } 
            } 
        }, 
        setTransition: function(transition) { 
            for (var i = 0; i < this.slides.length; i++) { 
                var slide = this.slides.eq(i) 
                slide.transition(transition); 
            } 
 
        }
    } 
    })        
  },
  methods: {
    go(res) {
      console.log(res);
      this.$router.push({ name: res });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
   .swiper-container {
        width: 100%;
        height: 300px;
        background: #ccc;
        margin: 20px auto;
    }
  .van-nav-bar {
    width: 100%;
  }
  .banner {
    display: flex;
    .content {
      div {
        font-size: 12px;
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
    font-size: 12px;
    display: block;
    margin: 0 auto;
    margin-top: 2rem;
  }
  .card {
    .input {
      width: 140px;
      height: 20px;
      margin-left: 10px;
      background: #f8f8f8;
      font-size: 10px;
    }
    width: 210px;
    height: 35px;
    border-bottom: 1px solid #c1c1c1;
  }
  font-size: 12.5px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
    color: #f8f8f8;
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
// src/pages/handle/index.vue