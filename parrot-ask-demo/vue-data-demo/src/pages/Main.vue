<template>
  <div>
    <router-view></router-view>
    <van-tabbar v-model="active" active-color="#FFF" route>
      <van-tabbar-item class="color" to="/home">
        <!-- <img slot="icon" src="../assets/images/homepages/bird.png" alt=""> -->
        <img slot="icon" slot-scope="props" :src="active==0?one:one1" />
        <span>鸟市场</span>
      </van-tabbar-item>
      <van-tabbar-item class="color" to="/situation">
        <!-- <img slot="icon" src="../assets/images/homepages/rob.png" alt=""> -->
        <img slot="icon" slot-scope="props" :src="active==1?two:two1" />
        <span>抢单池</span>
      </van-tabbar-item>
      <van-tabbar-item class="color" to="/serveCenter">
        <!-- <img slot="icon" src="../assets/images/homepages/serve.png" alt /> -->
        <img slot="icon" slot-scope="props" :src="active==2?three:three1" />
        <span>服务中心</span>
      </van-tabbar-item>
      <van-tabbar-item class="color" to="/my">
        <!-- <img slot="icon" src="../assets/images/homepages/user.png" alt /> -->
        <img slot="icon" slot-scope="props" :src="active==3?my:my1" />
        <span>我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import store from "@/vuex/store";
import { mapState } from "vuex";
export default {
  store,
  data() {
    return {
      one: require("@/assets/images/tabbar/bird_active.png"),
      one1: require("@/assets/images/tabbar/bird.png"),
      two: require("@/assets/images/tabbar/grab_active.png"),
      two1: require("@/assets/images/tabbar/grab.png"),
      three: require("@/assets/images/tabbar/service_active.png"),
      three1: require("@/assets/images/tabbar/service.png"),
      my: require("@/assets/images/tabbar/my_active.png"),
      my1: require("@/assets/images/tabbar/my.png"),
      active: 0,
      cartCount: ""
    };
  },
  computed: {
    ...mapState({
      selectGoods: state => state.selectGoods //绑定store.selectGoods到组件，之后可用this.selectGoods获取
    })
  },
  created() {
    if (this.$route.name == "situation") {
      this.active = 1;
    } else if (this.$route.name == "home") {
      this.active = 0;
    } else if (this.$route.name == "serveCenter") {
      this.active = 2;
    } else if (this.$route.name == "my") {
      this.active = 3;
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>
.van-hairline--top-bottom::after {
  border: none;
}
.van-tabbar-item__text {
  color: #fff;
}
.color {
  color: #815401;
  height: 49px;
  /* background: #50576a; */
  /*background: #333;*/
  /*background-image: url("../assets/images/homepages/bg.png"); */
}
</style>



// WEBPACK FOOTER //
// src/pages/Main.vue