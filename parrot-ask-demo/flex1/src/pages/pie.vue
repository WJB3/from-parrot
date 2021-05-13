<template>
  <div class="develop">
    <div class="item-top">
      <span class="icon"></span>
      <span style="color: #28e4ff; font-size: 12px">产业分布</span>
      <div class="top-border"></div>
    </div>
    <div class="pie" ref="pie"></div>
  </div>
</template>

<script>
// import resizemixin from "@/utils/resizeMixins.js";
export default {
  // mixins: [resizemixin],
  props: {
    // pieData: {
    //   type: Array,
    //   default: () => {},
    // },
  },
  data() {
    return {
      chart: null,
      data: [
        { value: 0, name: "", itemStyle: "#68e377" },
        { value: 0, name: "", itemStyle: "#21d6c4" },
        { value: 0, name: "", itemStyle: "#90a3f1" },
        { value: 0, name: "", itemStyle: "#5e92fb" },
        { value: 0, name: "", itemStyle: "#ffa629" },
      ],
    };
  },
  watch: {
    // pieData: {
    //   handler(v) {
    //     // console.log(v,'---pie----');
    //     for (const key in v) {
    //       this.data[key].name = v[key].industryChainDesc.substr(0, 4);
    //       this.data[key].value = v[key].summarizedResult;
    //       this.initPie();
    //     }
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  methods: {
    // initPie() {
    //   let _that = this;
    //   this.chart = echarts.init(this.$refs.pie);
    //   let option = {
    //     tooltip: {
    //       trigger: "item",
    //       formatter: ({ name, value }) => {
    //         let sum = 0;
    //         for (let i = 0; i < _that.data.length; i++) {
    //           sum += _that.data[i].value;
    //         }
    //         const obj = _that.data.find((item) => item.name === name);
    //         let per = ((obj.value / sum) * 100).toFixed(2) + "%";
    //         return per + " " + name;
    //       },
    //     },
    //     legend: {
    //       // selectedMode: false,
    //       top: "center",
    //       right: "0",
    //       icon: "circle",
    //       orient: "vertical",
    //       textStyle: { color: "#209dd3" },
    //       formatter: (name) => {
    //         let per = "";
    //         let sum = 0;
    //         for (let i = 0; i < _that.data.length; i++) {
    //           sum += _that.data[i].value;
    //         }
    //         const obj = _that.data.find((item) => item.name === name);
    //         per = ((obj.value / sum) * 100).toFixed(2) + "%";
    //         return per + " " + name;
    //       },
    //     },
    //     series: [
    //       {
    //         name: "",
    //         type: "pie",
    //         radius: [0, 60],
    //         center: ["35%", "50%"],
    //         roseType: "area",
    //         // labelLine: {
    //         //   length: 0,
    //         // },
    //         label: {
    //           fontSize: 12,
    //           color: "#209dd4",
    //         },
    //         data: this.data,
    //       },
    //     ],
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
    // background: url("../../../../../../assets/img/industry/icon_03.png")
    //   no-repeat;
    background: #ccc;
    background-size: contain;
    position: relative;
    top: 2px;
  }
  .top-border {
    position: relative;
    width: 100%;
    height: 4px;
    // background: url("../../../../../../assets/img/industry/border-01.png")
    //   no-repeat;
    background: #ccc;
    background-size: contain;
    margin-top: 5px;
  }
}
.pie {
  width: 100%;
  height: 200px;
}
</style>