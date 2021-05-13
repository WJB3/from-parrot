<template>
  <div class="dashboard-editor-container">
    <el-row style="padding: 0 10px 0 0">
      <!-- 头部通知 -->
      <div class="notice">
        <span class="iconfont icon-lingdang" />
        <p style="color: #ff3c3c">设备报警</p>
        <p>等离子切割机</p>
        <p>{{ nowDate }}</p>
        <p>设备运转过程中动率不足，速率降低，生产效率降低。</p>
        <p style="color: #4e9ef5">查看详情</p>
      </div>
      <el-col :span="17">
        <!-- 员工信息 -->
        <div class="header">
          <img src="../../../assets/images/home/avtor.jpg" alt="">
          <p>
            员工ID: <span>123456</span>
          </p>
          <p>
            员工姓名:
            <span>
              xxxx
            </span>
          </p>
          <p>班次: <span>xxx</span></p>
          <p>技能: <span>xxx</span></p>
          <p>技能等级: <span>xxx</span></p>
        </div>
        <!-- 钢板任务，质量管理 -->
        <div class="summary">
          <div>
            型板任务
            <div class="icon">
              <div class="left">
                <p class="f6">
                  <span class="iconfont icon-renwu" />
                </p>
                <div>
                  <p>计划任务数</p>
                  <span>8</span>
                </div>
              </div>
              <div class="right">
                <p class="f6">
                  <span
                    class="iconfont icon-renwu1"
                  />
                </p>
                <div>
                  <p>实际完成数</p>
                  <span>8</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            质量管理
            <div class="icon">
              <div class="left" style="color: #4bcdf8">
                <p class="f6">
                  <span
                    class="iconfont icon-chaxun"
                  />
                </p>
                <div>
                  <p>报检</p>
                  <span>8</span>
                </div>
              </div>
              <div class="right" style="color: #be66c6">
                <p class="f6">
                  <span class="iconfont icon-bianji" />
                </p>
                <div>
                  <p>不合格</p>
                  <span>8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 切割车间排产计划 -->
        <div
          id="myChart"
          :style="{
            width: '98%',
            height: '432px',
            background: '#fff',
            margin: '10px',
            padding: '4px 0 0 6px',
          }"
        />
      </el-col>
      <!-- 快捷导航 -->
      <el-col :span="7">
        <div class="navigation">
          <h3>快捷导航</h3>
          <div class="top">
            <div>
              <span
                class="iconfont icon-kucunchaxunbeifen2x"
                style="color:#5c58ef"
              />
              <p>库存查询</p>
            </div>
            <div>
              <span
                class="iconfont icon-laba"
                style="color:#d86ef3"
              />
              <p>缺料呼叫</p>
            </div>
            <div>
              <span
                class="iconfont icon-anquan"
                style="color:#fcc560;font-size:1.6rem"
              />
              <p>质检上报</p>
            </div>
          </div>
          <div class="bottom">
            <div>
              <span
                class="iconfont icon-kucunchaxunbeifen2x"
                style="color:#5c58ef"
              />
              <p>预处理工单</p>
            </div>
            <div>
              <span
                class="iconfont icon-laba"
                style="color:#d86ef3"
              />
              <p>钢板切割工单</p>
            </div>
            <div>
              <span
                class="iconfont icon-anquan"
                style="color:#fcc560;font-size:1.6rem"
              />
              <p>故障报警</p>
            </div>
          </div>
        </div>
        <!-- 今日任务  -->
        <div class="task">
          <div class="head">
            <h3>今日任务</h3>
            <span>更多</span>
          </div>
          <!-- <a-table :columns="columns" :data-source="data">
            <template #name="{ text }">
              <a>{{ text }}</a>
            </template>
          </a-table> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nowDate: ''
    }
  },
  mounted() {
    this.drawLine()
    this.currentTime()
  },
  // 销毁定时器
  beforeDestroy() {
    if (this.formatDate) {
      clearInterval(this.formatDate) // 在Vue实例销毁前，清除时间定时器
    }
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '切割车间排产计划'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            var tar
            if (params[1].value != '-') {
              tar = params[1]
            } else {
              tar = params[0]
            }
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value
          }
        },
        // legend: {
        //   data: ['支出', '收入']
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'category',
          splitLine: { show: false },
          data: (function() {
            var list = ['切割机一', '切割机二', '切割机三', '分拣机一', '分拣机二', '分拣机三']
            return list
          }())
        },
        xAxis: {
          type: 'value'
          // data:['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
        },
        series: [
          {
            name: '辅助',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)'
              },
              emphasis: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)'
              }
            },
            data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
          },
          {
            name: '收入',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: [900, 345, 393, '-', '-', 135, '-', '-', '-', '-', '-']
          },
          {
            name: '支出',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'bottom'
              }
            },
            data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
          }
        ]
      })
    },
    formatDate() {
      const date = new Date()
      const year = date.getFullYear() // 年
      const month = date.getMonth() + 1 // 月
      const day = date.getDate() // 日
      const week = date.getDay() // 星期
      const weekArr = [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六'
      ]
      let hour = date.getHours() // 时
      hour = hour < 10 ? '0' + hour : hour // 如果只有一位，则前面补零
      let minute = date.getMinutes() // 分
      minute = minute < 10 ? '0' + minute : minute // 如果只有一位，则前面补零
      let second = date.getSeconds() // 秒
      second = second < 10 ? '0' + second : second // 如果只有一位，则前面补零
      this.nowDate = `${year}/${month}/${day} ${hour}:${minute}:${second} ${weekArr[week]}`
    },
    currentTime() {
      setInterval(this.formatDate, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './index.scss'
</style>
