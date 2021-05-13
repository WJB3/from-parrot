<template>
  <div id="map-wrapper">
    <div id="city-map"></div>
  </div>
</template>

<script>
import { Scene, PointLayer } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
export default {
  data() {
    return {};
  },
  mounted() {
    this.initCityDotMap();
  },
  methods: {
    initCityDotMap() {
      const scene = new Scene({
        id: "city-map",
        logoVisible: false, //logo 是否显示
        map: new GaodeMap({
          pitch: 64.88,
          style: "dark",//设置地图的样式，我通过高德的那个设置，不生效
          center: [117.150737, 31.85736],
          // center: [114.060288, 22.53684], 这个坐标是深圳的，使用这个坐标地图会出现亮度图，跟下面请求的那个json数据有关
          zoom: 15.63,
        }),
      });
      scene.on("loaded", () => {
        fetch(
          "https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json"
        )
          .then((res) => res.json())
          .then((data) => {
            const pointLayer = new PointLayer({})
              .source(data)
              .size(2)
              .color("h8", [
                "#0A3663",
                "#1558AC",
                "#3771D9",
                "#4D89E5",
                "#64A5D3",
                "#72BED6",
                "#83CED6",
                "#A6E1E0",
                "#B8EFE2",
                "#D7F9F0",
              ])
              .style({
                opacity: 1,
              });

            scene.addLayer(pointLayer);
          });
      });
    },
  },
};
</script>

<style scoped>
#map-wrapper {
  position: relative;
  width: 100%;
  height: 300px;
}
#city-map {
  width: 100%;
  height: 300px;
}
</style>