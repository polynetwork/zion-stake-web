<template>
  <div class="mydashboard">
    <div class="line"></div>
    <div class="title">My Dashboard</div>
    <div class="content">
      <div class="item">
        <div class="left">
          <div class="item-title">My Stake</div>
          <div class="number">
            {{ integerToDecimal(dashboardData ? dashboardData.Mysatke : '') }}
            Zion
          </div>
          <div class="action"></div>
        </div>
        <div class="right">
          <img src="@/assets/img/svg/mydash1.svg" />
        </div>
      </div>
      <div class="item">
        <div class="left">
          <div class="item-title">My Reward</div>
          <div class="number">
            {{ integerToDecimal(dashboardData ? dashboardData.MyReward : '') }}
            Zion
          </div>
          <div class="action"></div>
        </div>
        <div class="right">
          <img src="@/assets/img/svg/mydash2.svg" />
        </div>
      </div>
      <div class="item">
        <div class="left">
          <div class="item-title">My annualized reward</div>
          <div class="number">
            {{
              formatNumber(
                dashboardData ? dashboardData.MyAnnualizedReward : ''
              )
            }}%
          </div>
          <div class="action"></div>
        </div>
        <div class="right">
          <img src="@/assets/img/svg/mydash3.svg" />
        </div>
      </div>
      <div class="item">
        <div class="left">
          <div class="item-title">Available</div>
          <div class="number">
            {{ integerToDecimal(dashboardData ? dashboardData.Available : '') }}
            Zion
          </div>
          <div class="action"></div>
        </div>
        <div class="right">
          <img src="@/assets/img/svg/mydash4.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { integerToDecimal } from '@/utils/convertors'
import format from '@/utils/formatters'
export default {
  name: 'DashboardView',
  computed: {
    wallets() {
      return this.$store.getters.wallets
    },
    wallet() {
      return this.wallets[0]
    },
    getDashboardParams() {
      if (this.wallet && this.wallet.address) {
        return {
          addressHex: this.wallet.address
        }
      }
      return null
    },
    dashboardData() {
      if (this.getDashboardParams) {
        const data = {
          addressHex: this.wallet.address
        }
        return this.$store.getters.getDashboard(data)
      }
      return []
    }
  },
  watch: {
    getDashboardParams(value) {
      if (value) {
        this.$store.dispatch('getDashboard', value)
      }
    }
  },
  mounted() {
    this.$store.dispatch('getDashboard', this.getDashboardParams)
  },
  methods: {
    integerToDecimal($val) {
      if ($val) {
        const num = integerToDecimal($val, 18)
        return format.$formatNumber(Number(num).toFixed(2))
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
.mydashboard {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 50px;
  .line {
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
    margin-bottom: 40px;
    margin-top: 26px;
  }
  .title {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 27px;
    color: #002568;
    margin-bottom: 20px;
  }
  .content {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    .item:nth-child(4) {
      margin-right: 0;
    }
    .item {
      width: 232px;
      height: 118px;
      border: 1px solid #002568;
      border-radius: 12px;
      margin-right: 25px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      .left {
        width: 75%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        align-items: flex-start;
        padding: 0 0 0 20px;
        .item-title {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 17px;
          /* identical to box height */
          display: flex;
          color: rgba(0, 37, 104, 0.5);
        }
        .number {
          font-family: 'Gilroy';
          font-style: normal;
          font-weight: 500;
          font-size: 24px;
          line-height: 33px;
          letter-spacing: 0.016em;
          color: #002568;
          text-align: left;
        }
      }
      .right {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }
    }
  }
}
</style>
