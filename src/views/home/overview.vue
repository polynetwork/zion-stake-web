<template>
  <div class="overview">
    <div class="title">Overview</div>
    <div class="content">
      <div class="left">
        <div class="number">
          {{ overviewData.EpochEndHeight - overviewData.BlockHeight }}
        </div>
        <div class="text">blocks until next round</div>
        <div class="progress">
          <ElProgress
            :percentage="progressNum ? progressNum : 0"
            class="el-progress"
            color="#00fff0"
            :text-inside="true"
            :show-text="false"
          />
        </div>
      </div>
      <div class="right">
        <div class="item">
          <div class="number">{{ formatNumber(overviewData.BlockHeight) }}</div>
          <div class="title">Block height</div>
        </div>
        <div class="item">
          <div class="number">{{ overviewData.NodesTotal }}</div>
          <div class="title">Nodes in total</div>
        </div>
        <div class="item">
          <div class="number">{{ overviewData.TotalStakeRate }}%</div>
          <div class="title">Total stake rate</div>
        </div>
        <div class="item">
          <div class="number">{{ overviewData.APR }}%</div>
          <div class="title">APR</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { integerToDecimal } from '@/utils/convertors'
import format from '@/utils/formatters'
import { ElProgress } from 'element-plus'
export default {
  name: 'HomeView',
  components: {
    ElProgress
  },
  data() {
    return {
      progressFormat: ''
    }
  },
  computed: {
    overviewData() {
      return this.$store.getters.getOverviewData()
    },
    progressNum() {
      if (this.overviewData) {
        const ret =
          ((this.overviewData.BlockHeight -
            this.overviewData.EpochStartHeight) *
            100) /
          (this.overviewData.EpochEndHeight -
            this.overviewData.EpochStartHeight)
        return Number(ret.toFixed(0))
      } else {
        return 0
      }
    }
  },
  mounted() {
    this.$store.dispatch('getOverviewData')
    this.interval = setInterval(() => {
      this.$store.dispatch('getOverviewData')
    }, 60000)
  },
  beforeUnmount() {
    clearInterval(this.interval)
  },
  methods: {
    integerToDecimal($val) {
      if ($val) {
        return format.$formatNumber(integerToDecimal($val, 18))
      } else {
        return '--'
      }
    },
    formatNumber($val) {
      if ($val) {
        return format.$formatNumber($val)
      } else {
        return '--'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.overview {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 40px;
  .title {
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 27px;
    color: #002568;
    margin-bottom: 20px;
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: row;
    .left {
      width: 301px;
      height: 149px;
      background: #002568;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 40px 20px;
      box-sizing: border-box;
      background-image: url("@/assets/img/svg/overviewback.svg");
      background-repeat: no-repeat;
      background-position: 50% 110%;
      margin-right: 50px;
      .number {
        ont-family: "Inter";
        font-style: normal;
        font-weight: 700;
        font-size: 32px;
        line-height: 24px;
        /* identical to box height, or 75% */
        letter-spacing: -0.006em;
        color: #ffffff;
        text-align: left;
        margin-bottom: 10px;
      }
      .text {
        text-align: left;
        font-family: "Inter";
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        /* identical to box height, or 150% */
        letter-spacing: -0.006em;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 10px;
      }
      .progress {
        width: 217px;
        height: 10px;
        .el-progress--line {
          margin-bottom: 15px;
        }
      }
    }
    .right {
      display: flex;
      flex: 1;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .item {
        text-align: left;
        .number {
          font-family: "Inter";
          font-style: normal;
          font-weight: 700;
          font-size: 32px;
          line-height: 39px;
          letter-spacing: -0.022em;
          color: #002568;
        }
        .title {
          font-family: "Inter";
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 24px;
          letter-spacing: -0.006em;
          color: rgba(0, 37, 104, 0.5);
        }
      }
    }
  }
}
</style>
