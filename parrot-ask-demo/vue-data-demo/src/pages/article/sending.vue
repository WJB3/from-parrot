<template>
  <div class="home">
    <Tabbar title="发件" :leftArrow="true" />
    <div>
      <div style="margin: 15px auto;width:90%;color:#333333;">标题</div>
      <div class="card">
        <input type="text" placeholder="请输入标题" v-model="temp.title" />
      </div>
      <div style="margin: 15px auto;width:90%;color:#333333;">正文</div>
      <div class="card1">
        <textarea type="text" placeholder="请输入正文" rows="5" cols="5" v-model="temp.content" />
      </div>
    </div>
    <button class="submit" @click="submit()">提交</button>
  </div>
</template>

<script>
// import Vue from "vue";
import { sendMail } from "@/api/home";
// import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    // console.log(Tabbar);
  },
  data() {
    return {
      temp: {}
    };
  },
  mounted() {},
  methods: {
    submit() {
      sendMail(this.temp).then(res => {});
    }
  }
};
</script>
<style lang="less" scoped>
.home {
  margin-bottom: 50px;
  font-size: 14px;
  color: #333333;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  min-height: 667px;
  .submit {
    border: none;
    color: #ffffff;
    background: #fba318;
    display: block;
    border-radius: 4px;
    margin: 100px auto;
    width: 90%;
    height: 40px;
  }
  .card:nth-child(0) {
    background: red;
    margin-top: 32px;
  }
  .card {
    input {
      margin-left: 10px;
      width: 100%;
      // background: #666666;
      background: transparent;
    }
    .button {
      &:hover {
        cursor: pointer;
      }
      width: 100px;
      height: 35px;
      background: #fba318;
      border-radius: 4px;
      text-align: center;
      line-height: 35px;
    }
    display: flex;
    margin: 15px auto;
    width: 90%;
    height: 35px;
    border: 1px solid #aaa4a2;
    border-radius: 4px;
  }
  .card1 {
    textarea {
      width: 100%;
      background: transparent;
      border-radius: 8px;
    }
    .button {
      &:hover {
        cursor: pointer;
      }
      width: 100px;
      height: 35px;
      background: #fba318;
      border-radius: 4px;
      text-align: center;
      line-height: 35px;
    }
    display: flex;
    margin: 15px auto;
    width: 90%;
    height: 85px;
    border-radius: 4px;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/article/sending.vue