<template>
  <div>
    <van-sticky>
      <van-nav-bar
        :title="title"
        :left-arrow="leftArrow"
        @click-left="goback()"
        :right-text="rightText"
        @click-right="go(goUrl)"
      ></van-nav-bar>
    </van-sticky>
  </div>
</template>

<script>
export default {
  props: ["title", "leftArrow", "change", "rightText", "goUrl"],
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    goback() {
      // if (
      //   this.goUrl &&
      //   this.goUrl !== "feed-output" &&
      //   this.goUrl !== "exchangeRecord"
      // )
      if (this.goUrl == "situation") {
        this.$router.push({ name: "situation" });
      } else {
        this.$router.go(-1);
      }
    },
    go(res) {
      this.$router.push({ name: res });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  font-size: 14px;
  [class*="van-hairline"]::after {
    border: 0;
  }
  .van-nav-bar {
    width: 100%;
    /*background: url("~@/assets/images/home/nav.png");*/
    //background-image: url("../assets/images/homepages/background.png");
    /*background-position: center;*/
  }
  .van-nav-bar__title {
    color: #333;
  }
  .van-nav-bar__text {
    color: #f8f8f8;
  }
  .van-nav-bar .van-icon {
    color: #f8f8f8;
  }
}
</style>



// WEBPACK FOOTER //
// src/components/tabbar.vue