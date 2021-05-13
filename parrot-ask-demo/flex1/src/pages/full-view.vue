<template>
  <div class="main">
    <div class="full-view-wrapper">
      <div class="full-content">
        <div class="full-item">
          <div class="item-top">
            <span class="icon"></span>
            <span style="color: #28e4ff; font-size: 12px">企业数量</span>
            <div class="top-border"></div>
          </div>
          <div class="item-bottom">
            <div class="item-bottom-content">
              <div class="num">{{ tabData.count }}</div>
            </div>
          </div>
        </div>
        <div class="full-item">
          <div class="item-top">
            <span class="icon"></span>
            <span style="color: #28e4ff; font-size: 12px">产值(万元)</span>
            <div class="top-border"></div>
          </div>
          <div class="item-bottom">
            <div class="item-bottom-content" v-if="tabData.summarizedResult3">
              <div class="num">{{ tabData.summarizedResult3 }}</div>
              <div class="bili" :class="tabData.percentage3 < 0 ? 'active' : ''">
                <span>{{ tabData.percentage3 * 100 + "%" }}</span>
                <span v-show="tabData.percentage3<0" style="position:relative;top:-2px;">↓</span>
                <span v-show="tabData.percentage3>0" style="position:relative;top:-2px;">↑</span>
              </div>
            </div>
          </div>
        </div>
        <div class="full-item">
          <div class="item-top">
            <span class="icon"></span>
            <span style="color: #28e4ff; font-size: 12px">税收(万元)</span>
            <div class="top-border"></div>
          </div>
          <div class="item-bottom extra">
            <div class="item-bottom-content" v-if="tabData.summarizedResult2">
              <div class="num">{{ tabData.summarizedResult2 }}</div>
              <div class="bili" :class="tabData.percentage2 < 0 ? 'active' : ''">
                <span>{{ tabData.percentage2 * 100 + "%" }}</span>
                <span v-show="tabData.percentage2<0" style="position:relative;top:-2px;">↓</span>
                <span v-show="tabData.percentage2>0" style="position:relative;top:-2px;">↑</span>
              </div>
            </div>
          </div>
        </div>
        <div class="full-item">
          <div class="item-top">
            <span class="icon"></span>
            <span style="color: #28e4ff; font-size: 12px">人员规模</span>
            <div class="top-border"></div>
          </div>
          <div class="item-bottom">
            <div class="item-bottom-content" v-if="tabData.summarizedResult4">
              <div class="num">{{ tabData.summarizedResult4 }}</div>
              <div class="bili" :class="tabData.percentage4 < 0 ? 'active' : ''">
                <span>{{ tabData.percentage4 * 100 + "%" }}</span>
                <span v-show="tabData.percentage4<0" style="position:relative;top:-2px;">↓</span>
                <span v-show="tabData.percentage4>0" style="position:relative;top:-2px;">↑</span>
              </div>
            </div>
          </div>
        </div>
        <div class="full-item">
          <div class="item-top">
            <span class="icon"></span>
            <span style="color: #28e4ff; font-size: 12px">占地面积(亩)</span>
            <div class="top-border"></div>
          </div>
          <div class="item-bottom">
            <div class="item-bottom-content" v-if="tabData.summarizedResult5">
              <div class="num">{{ tabData.summarizedResult5 }}</div>
              <div class="bili" :class="tabData.percentage5 < 0 ? 'active' : ''">
                <span>{{ tabData.percentage5 * 100 + "%" }}</span>
                <span v-show="tabData.percentage5<0" style="position:relative;top:-2px;">↓</span>
                <span v-show="tabData.percentage5>0" style="position:relative;top:-2px;">↑</span>
              </div>
            </div>
          </div>
        </div>
        <div class="full-item">
          <div class="item-top">
            <span class="icon"></span>
            <span style="color: #28e4ff; font-size: 12px">高新技术企业</span>
            <div class="top-border"></div>
          </div>
          <div class="item-bottom">
            <div class="item-bottom-content">
              <div class="num">20698</div>
              <div class="bili">12% ↑</div>
            </div>
          </div>
        </div>
        <div class="full-item">
          <div class="item-top">
            <span class="icon"></span>
            <span style="color: #28e4ff; font-size: 12px">专利数</span>
            <div class="top-border"></div>
          </div>
          <div class="item-bottom extra2">
            <div class="item-bottom-content">
              <div class="num">20698</div>
              <div class="bili">12% ↑</div>
            </div>
          </div>
        </div>
        <div class="full-item">
          <div class="item-top">
            <span class="icon"></span>
            <span style="color: #28e4ff; font-size: 12px"
              >固定资产投入(万元)</span
            >
            <div class="top-border"></div>
          </div>
          <div class="item-bottom">
            <div class="item-bottom-content">
              <div class="num">20698</div>
              <div class="bili">12% ↑</div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="full-content">
        
      </div> -->
    </div>
    <!-- 城市亮点图 -->
    <antv-l7-map></antv-l7-map>
    <!-- 饼图 -->
    <div class="product-wrapper">
      <line-pic :lineData="lineData"></line-pic>
      <pie-pic :pieData="pieData"></pie-pic>
      <funnel-pic :funnelData="funnelData"></funnel-pic>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import antvL7Map from "./antv-L7-map";
import LinePic from "./line";
import PiePic from "./pie";
import FunnelPic from "./funnel";
// import { industryPerson, industryPie } from "@/services/industry";

export default {
  props: {
    tabData: {
      type: Object,
      default: () => {},
    },
    lineData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    antvL7Map,
    LinePic,
    PiePic,
    FunnelPic,
  },
  data() {
    return {
      funnelData: [],
      pieData: [],
    };
  },
  mounted() {
    // this.getIndustryPerson();
    // this.getindustryPieData();
  },
  watch: {
    // tabData: {
    //   handler(v) {
    //     // console.log(v, "----props----");
    //   },
    //   immediate: true,
    // },
  },
  methods: {
    // 产业分布数据
    // async getindustryPieData() {
    //   const {
    //     data: { code, result },
    //   } = await industryPie();
    //   if (code === 200) {
    //     this.pieData = result;
    //   }
    // },
    // async getIndustryPerson() {
    //   const {
    //     data: { code, result },
    //   } = await industryPerson();
    //   if (code == 200) {
    //     this.funnelData = result;
    //   } else {
    //     this.$message.warning("产业人才信息获取失败");
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.full-view-wrapper{
  height: 15%;
  display: flex;
  flex-direction: column;
}
.main {
  margin-bottom: 10px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .full-content {
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    
    // justify-content: space-between;
    // margin-bottom: 10px;
    position: relative;
    z-index: 99;
    // &:first-child {
    //   margin-bottom: 10px;
    // }
    .full-item {
      // flex: 1;
      width: 23%;
      height: 50%;
      margin: 0 1%;
      position: relative;
      display: flex;
      flex-direction: column;
      .item-top {
        padding: 10px 0;
        height: 30%;
        .icon {
          display: inline-block;
          width: 8px;
          height: 15px;
          // background: url("../assets/img/industry/icon_03.png")
            // no-repeat;
            background: #f00;
          background-size: contain;
          position: relative;
          top: 2px;
        }
        .top-border {
          position: relative;
          width: 100%;
          height: 4px;
          // background: url("../assets/img/industry/border-01.png")
            // no-repeat;
            background: #f00;
          background-size: contain;
          margin-top: 5px;
        }
      }
      .item-bottom-content {
        display: flex;
        height: 100%;
        justify-content: space-between;
        align-items: center;

        .num {
          color: #fff;
          font-size: 16px;
          margin-left: 30px;
        }
        .bili {
          color: #0abff4;
          font-size: 18px;
          font-weight: bold;
          background: transparent;
        }
        .active {
          color: #ff932a;
        }
      }
      .item-bottom {
        height: 70%;
        // background: url("../assets/img/industry/bg_1.png")
          // no-repeat;
          background: #f00;
        background-size: contain;
      }
    }
  }
  .product-wrapper {
    // height: auto;
    height: 24%;
    display: flex;
    justify-content: space-between;
    margin: 1% ;
    & div {
      width: 100%;
      margin: 0 5px;
      // background: url("../assets/img/industry/bg_2.png")
        // no-repeat center center;
        background: #f00;
      background-size: 100% 100%;
    }
  }
  .mask {
    width: 100%;
    height: 300px;
    position: absolute;
    top: 0;
    left: 0;
    background: #0c368799;
    opacity: 0.6;
  }
}
</style>