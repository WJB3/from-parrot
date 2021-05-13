<template>
  <div class="finance-header">
        <div class="pie" ref="liquid"></div>
  </div> 
</template>

<script>
import "echarts-liquidfill";
export default {
  data() {
    return {
      chart: null, 
       
    };
  },
  mounted() {
    this.initPie()
  },
  methods: { 
    initPie() {
      console.log(this.$echarts)
      this.chart = this.$echarts.init(this.$refs.liquid);
      let option = {
        title: {
          text: "在\n\n产\n\n业\n\n占\n\n比",
          left: "left",
          top: 10,
          textStyle: {
            color: "#333",
            fontWeight: "normal",
            fontSize: 14,
          },
        },
        series: [
          {
            name: "水球图",
            type: "liquidFill",
            radius: "50%",
            center: ["50%", "55%"],
            waveAnimation: 10, // 动画时长
            amplitude: 5, // 振幅
            data: [0.3],
            color: "rgba(68, 197, 253,1)",
            label: {
              normal: {
                color: "#44C5FD",
                textStyle: {
                  fontSize: 16,
                  fontWeight: "normal",
                },
              },
            },
            outline: {
              show: true,
              borderDistance: 5,
              itemStyle: {
                borderColor: "rgba(68, 197, 253,1)",
                borderWidth: 2,
              },
            },
            backgroundStyle: {
              color: "rgba(68, 197, 253,.3)",
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.pie {
  width: 300px;
  height: 200px;
}
</style>