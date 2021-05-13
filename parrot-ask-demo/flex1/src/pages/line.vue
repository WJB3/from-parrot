<template>
  <div class="develop">
    <div class="item-top">
      <span class="icon"></span>
      <span style="color: #28e4ff; font-size: 12px">产业发展</span>
      <div class="top-border"></div>
    </div>
    <div class="line" ref="line"></div>
  </div>
</template>

<script>
// import resizemixin from "@/utils/resizeMixins.js";
export default {
  // mixins: [resizemixin],
  props: {
    // lineData: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  data() {
    return {
      chart: null,
      data: [],
      periodCode: [], // x类目轴 年份数据
      legendName: [],
    };
  },
  watch: {
    // lineData: {
    //   handler(v) {
    //     var periodCode = [];
    //     v.forEach((x) => {
    //       periodCode.push(x.periodCode);
    //       this.legendName.push(x.industryChainDesc);
    //       this.data.push({
    //         name: x.industryChainDesc,
    //         data: x.summarizedResult,
    //       });
    //     });
    //     periodCode.forEach((item) => {
    //       if (this.periodCode.indexOf(item) === -1) {
    //         this.periodCode.push(item); // x类目轴年份
    //       }
    //     });
    //     this.$nextTick(() => {
    //       this.initLine();
    //     });
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  methods: {
    // initLine() {
    //   let list = [];
    //   this.data.forEach((item) => {
    //     const findItem = list.find((e) => e.name === item.name);
    //     if (!findItem) {
    //       list.push({
    //         name: item.name,
    //         type: "line",
    //         data: [],
    //       });
    //     }
    //     const idx = list.findIndex((e) => e.name === item.name);
    //     list[idx].data.push(item.data);
    //   });
    //   this.chart = echarts.init(this.$refs.line);
    //   var option = {
    //     tooltip: {
    //       trigger: "axis",
    //     },
    //     legend: {
    //       top: 10,
    //       textStyle: {
    //         color: "#209dd3",
    //       },
    //     },
    //     grid: {
    //       left: "3%",
    //       right: "6%",
    //       bottom: "10%",
    //       containLabel: true,
    //     },
    //     xAxis: {
    //       type: "category",
    //       axisLabel: {
    //         color: "#209dd3",
    //       },
    //       boundaryGap: false,
    //       data: this.periodCode,
    //     },
    //     yAxis: {
    //       type: "value",
    //       splitNumber: 4,
    //       axisLabel: {
    //         color: "#209dd3",
    //       },
    //       splitLine: {
    //         lineStyle: {
    //           color: ["#209dd3"],
    //           type: "dashed",
    //         },
    //       },
    //     },
    //     series: list,
    //   };
    //   this.chart.setOption(option);
    // },
  },
};
</script>

<style lang="scss" scoped>
.item-top {
  padding: 10px;
  height: 20px;
  .icon {
    display: inline-block;
    width: 8px;
    height: 15px;
    // background: url("../assets/img/industry/icon_03.png")
      // no-repeat;
      background: #ccc;
    background-size: contain;
    position: relative;
    top: 2px;
  }
  .top-border {
    position: relative;
    width: 100%;
    height: 4px;
    background: #ccc;
    // background: url("../assets/img/industry/border-01.png")
      // no-repeat;
    background-size: contain;
    margin-top: 5px;
  }
}
.line {
  width: 100%;
}
</style>