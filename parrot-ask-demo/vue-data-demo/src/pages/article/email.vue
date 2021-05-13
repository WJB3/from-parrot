<template>
  <div class="home">
    <!-- <Tabbar :title="title" :leftArrow="true"/> -->
    <Tabbar :title="title" :leftArrow="true" :rightText="text" goUrl="sending" />
    <div
      class="card"
      v-for="(item,index) in arr"
      :key="index"
      @click="go('email-detail',item,$route.query.id)"
    >
      <div class="content">
        <span>{{item.title}}</span>
        <div>{{item.content}}</div>
      </div>
      <div class="bottom">
        <span>{{item.add_time}}</span>
        <span style="margin-left:20px">{{item.create_time}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from "vue";
import { userReceive, userSend } from "@/api/home";
// import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    if (this.$route.query.id == 0) {
      this.text = "";
      this.title = "收件箱";
      userReceive().then(res => {
        this.arr = res;
      });
    } else {
      this.text = "发件";
      this.title = "发件箱";
      userSend().then(res => {
        this.arr = res;
      });
    }
  },
  data() {
    return {
      text: "",
      title: "",
      arr: []
    };
  },
  mounted() {},
  methods: {
    go(res, item, id) {
      this.$router.push({ name: res, params: { item: item, id: id } });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  font-size: 16px;
  color: #c1c1c1;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  min-height: 640px;
  .van-cell {
    margin-left: -10px;
    width: 100%;
    color: white;
    background: #666666;
  }
  .card {
    width: 92%;
    margin: 10px 15px;
    div {
      width: 95%;
      overflow: hidden;
      font-size: 12px;
      margin-bottom: 9px;
      line-height: 15px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .header {
      font-size: 16px;
    }
    .content {
      span {
        margin-left: 15px;
        width: 60px;
      }
      display: flex;
    }
    .bottom {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      div {
        width: 50px;
      }
    }
    border-bottom: 1px solid;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/article/email.vue