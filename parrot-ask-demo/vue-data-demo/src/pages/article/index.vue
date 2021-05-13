<template>
  <div class="home">
    <Tabbar title="系统消息" :leftArrow="true" />
    <div class="card" v-for="(item,index) in arr" :key="index" @click="go('article-detail',item)">
      <div class="header van-ellipsis">{{item.title}}</div>
      <div>
        <div>{{item.create_time}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { noticeList } from "@/api/home";
import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    noticeList({ page: 1, pagesize: 10000 }).then(res => {
      this.arr = res.data;
    });
  },
  data() {
    return {
      arr: []
    };
  },
  mounted() {},
  methods: {
    go(res, id) {
      this.$router.push({ name: res, params: { id: id } });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  font-size: 16px;
  color: #333333;
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
      width: 90%;
      overflow: hidden;
      font-size: 12px;
      margin-bottom: 9px;
      line-height: 15px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .header {
      font-size: 16px;
      padding-bottom: 3px;
    }
    .content {
    }
    .bottom {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      div {
        width: 120px;
      }
    }
    border-bottom: 1px solid #e1e1e1;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/article/index.vue