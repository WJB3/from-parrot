<template>
  <div class="home">
    <van-nav-bar title="服务中心"/>
    <van-cell-group>
      <div class="cell">
        <van-cell :to="{name:'email',query:{id:0}}" title="收件箱" is-link  />
      </div>
      <div class="cell">
        <van-cell is-link :to="{name:'email',query:{id:1}}" title="发件箱"  />
      </div>
      <div class="cell">
        <van-cell to="article" title="系统公告" is-link  />
      </div>
    </van-cell-group>
  </div>
</template>

<script>
  export default {
    name: "serveCenter",
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="less">
  .van-nav-bar__title{
    max-width: 100%;
  }
  .van-nav-bar{
    height: 50px;
    border-bottom: 1px solid #333;
   background-image: url("../../assets/images/homepages/background.png");
  }
  .van-cell-group{
    background: none;
  }
  .van-cell{

    padding: 15px 0 13px 0;
    background: none;
  }
  .cell{
    margin: 0 18px 0 12.5px;
    border-bottom: 1px solid #333333;
  }

</style>



// WEBPACK FOOTER //
// src/pages/serve/serveCenter.vue