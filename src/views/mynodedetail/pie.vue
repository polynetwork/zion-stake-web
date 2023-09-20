<template>
  <div class="echarts-box">
    <div class="lenged" v-if="nowStakeData">
      <div class="lenged-item">
        <div class="lenged-c node"></div>
        <div class="lenged-name">
          <span>{{ this.nodeP.toFixed(2) + '%' }}</span>
          {{ ' Node stake ' + this.nowStakeData.nodeStake }}
        </div>
      </div>
      <div class="lenged-item">
        <div class="lenged-c user"></div>
        <div class="lenged-name">
          <span>{{ this.userP.toFixed(2) + '%' }}</span>
          {{ ' User stake ' + this.nowStakeData.userStake }}
        </div>
      </div>
    </div>
    <div id="myEcharts" :style="{ width: '200px', height: '200px' }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
const echart = echarts
export default {
  name: 'echartsBox',
  props: {
    stakeData: Object
  },
  data() {
    return {
      userwidth: 0,
      nodewidth: 0,
      userP: 0,
      nodeP: 0,
      userL: 0,
      userT: 0,
      nodeL: 0,
      nodeT: 0,
      userZ: 0,
      nodeZ: 0
    }
  },
  computed: {
    nowStakeData() {
      if (this.stakeData) {
        return this.stakeData
      }
      return null
    }
  },
  watch: {
    nowStakeData(val) {
      this.userP = this.userwidth =
        (this.nowStakeData.userStake * 100) / this.nowStakeData.totalStake
      this.nodeP = this.nodewidth =
        (this.nowStakeData.nodeStake * 100) / this.nowStakeData.totalStake
      if (this.userwidth < 20) {
        this.userwidth = 20
        this.nodewidth = 80
      }
      if (this.nodewidth < 20) {
        this.nodewidth = 20
        this.userwidth = 80
      }
      if (this.userwidth > this.nodewidth) {
        this.userL = 50 - this.userwidth / 2 - this.nodewidth / 4
        this.userT = 0
        this.nodeL = 50 + this.userwidth / 2.8 - this.nodewidth / 1.4
        this.nodeT = 50 + this.userwidth / 2.8 - this.nodewidth / 1.2
        this.userZ = 0
        this.nodeZ = 1
      }
      if (this.userwidth <= this.nodewidth) {
        this.nodeL = 50 - this.nodewidth / 2 - this.userwidth / 4
        this.nodeT = 0
        this.userL = 50 + this.nodewidth / 2.8 - this.userwidth / 1.4
        this.userT = 50 + this.nodewidth / 2.8 - this.userwidth / 1.2
        this.userZ = 1
        this.nodeZ = 0
      }
      console.log(this.userwidth, this.userT, this.userL)
      console.log(this.nodewidth, this.nodeT, this.nodeL)
      this.initChart()
    }
  },
  methods: {
    initChart() {
      console.log(this.nowStakeData)
      const chart = echart.init(document.getElementById('myEcharts'))
      // 把配置和数据放这里
      chart.setOption({
        title: {
          left: 'center'
        },
        color: ['#ECCC50', '#0E393A'],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: false,
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'UserStake',
            type: 'pie',
            width: this.userwidth + '%',
            radius: '100%',
            left: this.userL + '%',
            top: this.userT + '%',
            silent: true,
            z: this.userZ,
            label: {
              position: 'center',
              fontSize: 14,
              color: '#ffffff'
            },
            data: [
              {
                value: this.nowStakeData.userStake,
                name: this.userP.toFixed(2) + '%'
              }
            ]
          },
          {
            name: 'NodeStake',
            type: 'pie',
            width: this.nodewidth + '%',
            radius: '100%',
            left: this.nodeL + '%',
            top: this.nodeT + '%',
            silent: true,
            z: this.nodeZ,
            label: { position: 'center', fontSize: 14, color: '#ffffff' },
            data: [
              {
                value: this.nowStakeData.nodeStake,
                name: this.nodeP.toFixed(2) + '%'
              }
            ]
          }
        ]
      })
      window.onresize = function () {
        // 自适应大小
        chart.resize()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.echarts-box {
  .lenged {
    .lenged-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 5px;
      .node {
        background: #0e393a;
      }
      .user {
        background: #eccc50;
      }
      .lenged-c {
        width: 6px;
        height: 6px;
        border-radius: 3px;
        margin-right: 4px;
      }
      .lenged-name {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 10px;
        line-height: 7px; /* identical to box height, or 69% */ /* Base Shade / 70 */
        color: rgba(0, 0, 0, 0.7);
        span {
          font-weight: 700;
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }
}
</style>
