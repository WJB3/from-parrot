<template>
  <div class="home">
    <Tabbar title="系统消息" :leftArrow="true" />
    <div class="card">
      <div class="header">{{item.title}}</div>
      <div class="content">{{item.content}}</div>
      <div class="bottom" style="margin-left:210px">{{item.create_time}}</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import url from "../../assets/js/api.js";
import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    this.item = this.$route.params.id;
  },
  data() {
    return {
      item: {}
    };
  },
  mounted() {},
  methods: {}
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
    width: 100%;
    color: white;
    background: #666666;
  }
  .card {
    width: 100%;
    padding: 10px 15px;
    div {
      width: 90%;
      overflow: hidden;
      font-size: 12px;
      margin-bottom: 10px;
    }
    .header {
      font-size: 16px;
    }
    .content {
      line-height: 2;
      font-size:14px;
    }
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/article/detail.vue