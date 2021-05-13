<template>
  <div id="map-wrapper">
    <div id="city-map"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.initCityDotMap();
  },
  methods: {
    initCityDotMap() {
      if (window.AMap) {
        //删除前，必须要加上。不然其他页面使用vue-amap组件会出错
        window.vueAmap = window.AMap;
        delete window.AMap;
      }
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://unpkg.com/@antv/l7";
      document.head.appendChild(script);
      let _this = this;
      script.onload = () => {
        const scene = new L7.Scene({
          id: "city-map",
          logoVisible: false, //logo 是否显示

          map: new L7.GaodeMap({
            pitch: 65, //视角
            style:
              "amap://styles/3dc306d39b7600028b6350a3e19ff94a?isPublic=true",
            center: [117.150737, 31.85736], //蜀山区坐标 117.181047,31.859656
            // center:[114.060288, 22.53684 ],
            zoom: 15.63, //缩放比利
            token: "85945142ba1233c334d21fdcc79a9a9f",
          }),
        });
        scene.mapStyle;
        // console.log(scene, "----sence----");
        // "https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json"
        fetch("./data.json")
          .then((res) => res.json())
          console.log(res)
          .then((data) => {
            console.log(data, "----data-----");
            data.features = data.features.slice(10000, 15000);
            const pointLayer = new L7.PointLayer({})
              .source(data)
              .size(2)
              .color("h8", [
                "#142c6c",
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
                opacity: 0.6,
              });
            scene.addLayer(pointLayer);
            _this.$forceUpdate();
          });
      };
    },
  },
};
</script>

<style lang="scss" scoped>
#map-wrapper {
  position: relative;
  width: 100%;
  height: 60%;
  margin-top: 20px;
  #city-map {
    width: 100%;
    height: 300px;
  }
}
</style>