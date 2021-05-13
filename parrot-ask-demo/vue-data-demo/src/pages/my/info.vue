<template>
  <div class="home">
    <Tabbar title="设置" :leftArrow="true" />
    <div class="img">
      <van-uploader :after-read="afterRead">
        <img v-if="temp.head_image" :src="temp.head_image" />
        <img v-else src="../../assets/images/default.png" />
        <span style="margin-left:20px;">点击更换头像</span>
      </van-uploader>
    </div>
    <!-- <van-field label="手机号" placeholder="请输入手机号" readonly v-model="temp.member" /> -->
    <van-field label="推荐人账号" placeholder="请输入推荐人账号" readonly v-model="temp.parent_member" />
    <van-field label="推荐人昵称" placeholder="请输入推荐人昵称" readonly v-model="temp.parent_nick_name" />
    <van-field label="昵称" placeholder="请输入昵称" v-model="temp.nick_name" />
    <!-- <van-field label="真实姓名" placeholder="请输入真实姓名" v-model="temp.name" />
    <van-field label="身份证号" placeholder="请输入身份证号" v-model="temp.card" /> -->
    <button class="submit" @click="submit()">确定</button>
  </div>
</template>

<script>
import Vue from "vue";
import { userInfo, userInfoCommit, fileUpload } from "@/api/home";
import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    userInfo().then(res => {
      this.temp = res;
    });
  },
  data() {
    return {
      temp: {
        nick_name:'',
        name:'',
        card:''
      }
    };
  },
  mounted() {},
  methods: {
    afterRead(file) {
      let formData = new FormData();
      formData.append("image", file.file);
      fileUpload(formData).then(res => {
        this.temp.head_image = res.path;
      });
    },
    submit() {
      userInfoCommit(this.temp).then(res => {
        this.$router.push({ name: "my" });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  font-size: 14px;
  color: #c1c1c1;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  min-height: 640px;
  padding-bottom: 5px;
  .van-cell {
    width: 96%;
    
  }
  /deep/ .van-cell__value {
    input {
      // color: #f8f8f8;
    }
  }
  .relative {
    position: relative;
  }
  .img {
    padding: 20px 0 0 20px;
    display: flex;
    align-items: center;
    margin-bottom:10px;
    img {
      width: 60px;
      height: 60px;
    }
  }
  .button {
    position: absolute;
    right: 20px;
    bottom: 82px;
    width: 80px;
    height: 25px;
    border-radius: 20px;
    border: 1px solid sandybrown;
    text-align: center;
    line-height: 25px;
  }
  .submit {
    border: none;
    background: #FBA318;
    display: block;
    font-size: 18px;
    border-radius: 4px;
    margin: 50px auto;
    width: 90%;
    height: 40px;
    color: #ffffff;
  }
  .van-cell {
    width: 96%;
    color: #333333;
    margin:0 auto;
    background: transparentf;
    // border-bottom:1px solid #999;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/my/info.vue