<template>
  <div class="finance-header"> 
      <pie></pie>
  </div>
</template>

<script>
import "echarts-liquidfill";
import pie from './index'
export default {
  components:{
    pie
  }, 
};
</script>

<style lang="scss" scoped>
.finance-header {
  width: 100%;
  .finance-card {
    width: 100%;
    height: 100%;
    /deep/.el-card__body {
      display: flex;
      align-items: center;
      height: 100%;
      box-sizing: border-box;
    }
  }
  .finance-left,
  .finance-right {
    height: 100%;
    width: 100%;
  }
  .finance-left {
    border-right: 1px solid #f0f0f0;
    padding-right: 10px;
    .ul-list {
      width: 100%;
      display: flex;
      li {
        box-sizing: border-box;
        color: #9a9a9a;
        border-bottom: 2px solid transparent;
        //margin-right: 15px;
        padding-bottom: 8px;
        .name {
          &::after {
            content: attr(10);
            color: #f70606;
          }
        }

        &:hover {
          cursor: pointer;
          color: #343434;
        }
      }
    }
    .ul-table {
      li {
        border-bottom: 1px solid #f0f0f0;
        line-height: 30px;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
      }
    }
  }
  .finance-right {
    width: 50%;
    display: flex;
    padding-left: 10px;
    .warning {
      width: 45%;
      height: 100%;
      display: flex;
      border-right: 1px solid #f0f0f0;
      flex-direction: column;
      div {
        height: 100%;
        span {
          display: block;
          &:last-child {
            font-size: 20px;
            color: red;
          }
        }
      }
    }
  }
}
.pie {
  width: 40%;
  height: 240px;
}
</style>