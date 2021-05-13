<template>
  <div class="develop">
    <div class="item-top">
      <span class="icon"></span>
      <span style="color: #28e4ff; font-size: 12px">产业人才</span>
      <div class="top-border"></div>
    </div>
    <div class="funnel" ref="funnel"></div>
  </div>
</template>

<script>
// import resizemixin from "@/utils/resizeMixins.js";
export default {
  // mixins: [resizemixin],
  props: {
    // funnelData: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  data() {
    return {
      chart: null,
      // data: [

      // ],
    };
  },
  watch: {
    funnelData: {
      handler(v) {
        // console.log(v, "****watch v *****");
        // for (const key in v) {
        //   (this.data[key].name = v[key].name), this.initFunnel();
        // }
        this.$nextTick(() => {
          this.initFunnel();
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    initFunnel() {
      // var maxNum = this.funnelData[0].num;
      // console.log(maxNum);
      // for (var i = 0; i < this.funnelData.length; i++) {
      //   if (maxNum < this.funnelData[i].num) {
      //     maxNum = this.funnelData[i].num;
      //   }
      // }
      // console.log(maxNum);
      this.chart = echarts.init(this.$refs.funnel);
      let option = {
        color: ["#345ebf", "#307ab3", "#34a6bf", "#3ee6e3", "#24C39D"],
        tooltip: {}, //提示
        radar: {
          name: {
            show: false,
          },
          indicator: [
            { name: "A", max: 337717 },
            { name: "B", max: 337717 },
            { name: "C", max: 337717 },
            { name: "D", max: 337717 },
            { name: "E", max: 337717 },
            { name: "F", max: 337717 },
            { name: "G", max: 337717 },
            { name: "H", max: 337717 },
          ],
          center: ["50%", "20%"],
          radius: "120%",
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          splitArea: {
            show: false,
          },
        },
        series: [
          {
            type: "radar",
            areaStyle: {
              opacity: 1,
              shadowBlur: 1,
              shadowColor: "rgba(0,0,0,.5)",
            },
            emphasis: {
              areaStyle: {
                opacity: 0,
              },
            },
            silent: true,
            // data: this.data,
            data: [
              {
                value: [0, 0, 0, 337717, 337717, 337716, 0, 0],
                name: "高级职称的专业技术人才数",
                symbol: "circle",
                symbolSize: 1,
                label: {
                  show: true,
                  fontSize: 10,
                  color: "#22a9df",
                  position: [0, -5],
                  formatter: function (point) {
                    if (point.value == 337716) return "—— " + point.name;
                    else return "";
                  },
                },
              },
              {
                value: [0, 0, 0, 333011, 333012, 333012, 0, 0],
                name: "硕士及以上学历人才数",
                symbol: "circle",
                symbolSize: 1,
                label: {
                  show: true,
                  position: [-80, -50],
                  fontSize: 10,
                  color: "#22a9df",
                  formatter: function (point) {
                    if (point.value == 333011) return point.name + " ——";
                    else return "";
                  },
                },
              },
              {
                value: [0, 0, 0, 89113, 89113, 89112, 0, 0],
                name: "当年引进“985”毕业生数",
                symbol: "circle",
                symbolSize: 1,
                label: {
                  show: true,
                  position: [-5, -10],
                  fontSize: 10,
                  color: "#22a9df",
                  formatter: function (point) {
                    if (point.value == 89112) return "——" + point.name;
                    else return "";
                  },
                },
              },
              {
                value: [0, 0, 0, 45874, 45875, 45875, 0, 0],
                name: "高技能人才数",
                symbol: "circle",
                symbolSize: 1,
                label: {
                  show: true,
                  position: [-75, -10],
                  fontSize: 10,
                  color: "#22a9df",
                  formatter: function (point) {
                    if (point.value == 45874) return point.name + " ——";
                    else return "";
                  },
                },
              },
              {
                value: [0, 0, 0, 11911, 11911, 11910, 0, 0],
                name: "当年引进“211”毕业生数",
                symbol: "circle",
                symbolSize: 1,
                label: {
                  show: true,
                  position: [0, -5],
                  fontSize: 10,
                  color: "#22a9df",
                  formatter: function (point) {
                    if (point.value == 11910) return "—— " + point.name;
                    else return "";
                  },
                },
              },
            ],
          },
        ],
        itemStyle: {
          emphasis: {
            show: false,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      };
      this.chart.setOption(option);
    },
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
.funnel {
  width: 100%;
  height: 200px;
}
</style>