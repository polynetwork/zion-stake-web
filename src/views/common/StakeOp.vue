<template>
  <div class="stakeop" v-if="stakeInfo">
    <div class="op-tab">
      <div
        :class="activeNum === 0 ? 'op-item active' : 'op-item'"
        @click="activeNum = 0"
      >
        Stake
      </div>
      <div
        :class="activeNum === 1 ? 'op-item active' : 'op-item'"
        @click="activeNum = 1"
      >
        Unstake
      </div>
      <div
        :class="activeNum === 2 ? 'op-item active' : 'op-item'"
        @click="activeNum = 2"
      >
        Claim
      </div>
      <div
        :class="activeNum === 3 ? 'op-item active' : 'op-item'"
        @click="activeNum = 3"
      >
        Withdraw
      </div>
    </div>
    <div v-if="activeNum === 0" class="stake op-detail-item">
      <div class="info">
        <div class="title">Stake amount:</div>
        <div class="val">
          {{ integerToDecimal(stakeInfo.StakeAmount) }} Zion
        </div>
      </div>
      <div class="input">
        <img src="@/assets/img/svg/tokenicon.svg" />
        <input v-model="stakeAmount" />
        <div class="max-btn">MAX</div>
      </div>
      <div class="balance">Balance: {{ Number(balance).toFixed(2) }} Zion</div>
      <div class="stake-btn btn" @click="newStake()">Stake</div>
      <div class="info">
        <div class="title">Maximum staking amount:</div>
        <div class="val">
          {{ integerToDecimal(stakeInfo.MaxStakeAmount) }} Zion
        </div>
      </div>
      <div class="info">
        <div class="title">Expected APR:</div>
        <div class="val">{{ stakeInfo.ExpectedAPR }} %</div>
      </div>
      <div class="info">
        <div class="title">Expected annualized reward amount:</div>
        <div class="val">
          {{ ((stakeAmount * stakeInfo.ExpectedAPR) / 100).toFixed(2) }} Zion
        </div>
      </div>
    </div>
    <div v-if="activeNum === 1" class="Unstake op-detail-item">
      <div class="info">
        <div class="title">Stake amount:</div>
        <div class="val">
          {{ integerToDecimal(stakeInfo.StakeAmount) }} Zion
        </div>
      </div>
      <div class="info">
        <div class="title">Freeze amount:</div>
        <div class="val">
          {{ integerToDecimal(stakeInfo.FreezeAmount) }} Zion
        </div>
      </div>
      <div class="input">
        <img src="@/assets/img/svg/tokenicon.svg" />
        <input v-model="unstakeAmount" />
        <div class="max-btn">MAX</div>
      </div>
      <div class="stake-btn btn" @click="unStake()">UnStake</div>
    </div>
    <div v-if="activeNum === 2" class="Claim op-detail-item">
      <div class="claim-img"><img src="@/assets/img/svg/tokenicon.svg" /></div>
      <div class="reward-num">
        {{ stakeInfo ? integerToDecimal(stakeInfo.RewardAmount) : '--' }} Zion
      </div>
      <div class="reward-title">Reward amount</div>
      <div class="claim-btn btn" @click="claimReward()">Claim</div>
    </div>
    <div v-if="activeNum === 3" class="Withdraw op-detail-item">
      <div class="info">
        <div class="title">Stake amount:</div>
        <div class="val">
          {{ integerToDecimal(stakeInfo.StakeAmount) }} Zion
        </div>
      </div>
      <div class="info">
        <div class="title">Freeze amount:</div>
        <div class="val">
          {{ integerToDecimal(stakeInfo.FreezeAmount) }} Zion
        </div>
      </div>
      <div class="info">
        <div class="title">Claimable amount:</div>
        <div class="val">
          {{ integerToDecimal(stakeInfo.ClaimableAmount) }} Zion
        </div>
      </div>
      <div class="stake-btn btn" @click="userWithdraw()">Withdraw</div>
    </div>
  </div>
</template>

<script>
import { integerToDecimal } from '@/utils/convertors'
import format from '@/utils/formatters'
import { getWalletApi } from '@/utils/walletApi'
import delay from 'delay'
import { SingleTransactionStatus } from '@/utils/enums'
export default {
  name: 'stakeView',
  props: {
    stakeInfo: Object,
    consensusAddress: String
  },
  computed: {
    wallets() {
      return this.$store.getters.wallets
    },
    wallet() {
      return this.$store.getters.wallets[0]
    },
    getBalanceParams() {
      if (this.wallet) {
        return {
          chainId: 3,
          address: this.wallet.address
        }
      }
      return null
    },
    balance() {
      return this.$store.getters.getBalance(this.getBalanceParams)
    }
  },
  data() {
    return {
      activeNum: 0,
      stakeAmount: 0,
      unstakeAmount: 0,
      stakeAmountInfo: {
        ClaimableAmount: '0',
        ExpectedAPR: 0,
        FreezeAmount: '0',
        MaxStakeAmount: '0',
        RewardAmount: '0',
        StakeAmount: '0'
      }
    }
  },
  created() {
    this.$store.dispatch('getBalance', this.getBalanceParams)
  },
  watch: {
    getBalanceParams(value) {
      this.$store.dispatch('getBalance', value)
    }
  },
  methods: {
    integerToDecimal($val) {
      if ($val) {
        return format.$formatNumber(integerToDecimal($val, 18))
      } else {
        return 0
      }
    },
    formatNumber($val) {
      if ($val) {
        return format.$formatNumber($val)
      } else {
        return '--'
      }
    },
    async unStake() {
      const walletApi = await getWalletApi(this.wallet.name)
      const transactionHash = await walletApi.unStake({
        stakeAddress: this.wallet.address,
        chainId: 3,
        consensusAddress: this.consensusAddress,
        unstakeAmount: this.unstakeAmount
      })

      let status = SingleTransactionStatus.Pending
      await delay(2000)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          // eslint-disable-next-line no-await-in-loop
          status = await walletApi.getTransactionStatus({ transactionHash })
          if (status !== SingleTransactionStatus.Pending) {
            break
          }
          // eslint-disable-next-line no-await-in-loop
          await delay(5000)
        } catch (error) {
          // ignore error
        }
      }
      await delay(9000)
      this.$emit('update')
      console.log(transactionHash)
    },
    async newStake() {
      const walletApi = await getWalletApi(this.wallet.name)
      const transactionHash = await walletApi.newStake({
        stakeAddress: this.wallet.address,
        chainId: 3,
        consensusAddress: this.consensusAddress,
        amount: this.stakeAmount
      })

      let status = SingleTransactionStatus.Pending
      await delay(2000)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          // eslint-disable-next-line no-await-in-loop
          status = await walletApi.getTransactionStatus({ transactionHash })
          if (status !== SingleTransactionStatus.Pending) {
            break
          }
          // eslint-disable-next-line no-await-in-loop
          await delay(5000)
        } catch (error) {
          // ignore error
        }
      }
      await delay(9000)
      this.$emit('update')
      console.log(transactionHash)
    },
    async claimReward() {
      const walletApi = await getWalletApi(this.wallet.name)
      const transactionHash = await walletApi.claimReward({
        stakeAddress: this.wallet.address,
        chainId: 3,
        consensusAddress: this.consensusAddress
      })
      let status = SingleTransactionStatus.Pending
      await delay(2000)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          // eslint-disable-next-line no-await-in-loop
          status = await walletApi.getTransactionStatus({ transactionHash })
          if (status !== SingleTransactionStatus.Pending) {
            break
          }
          // eslint-disable-next-line no-await-in-loop
          await delay(5000)
        } catch (error) {
          // ignore error
        }
      }
      await delay(9000)
      this.$emit('update')
      console.log(transactionHash)
    },
    async userWithdraw() {
      const walletApi = await getWalletApi(this.wallet.name)
      const transactionHash = await walletApi.userWithdraw({
        stakeAddress: this.wallet.address,
        chainId: 3
      })
      let status = SingleTransactionStatus.Pending
      await delay(2000)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          // eslint-disable-next-line no-await-in-loop
          status = await walletApi.getTransactionStatus({ transactionHash })
          if (status !== SingleTransactionStatus.Pending) {
            break
          }
          // eslint-disable-next-line no-await-in-loop
          await delay(5000)
        } catch (error) {
          // ignore error
        }
      }
      await delay(9000)
      this.$emit('update')
      console.log(transactionHash)
    }
  }
}
</script>
<style lang="scss" scoped>
.stakeop {
  width: 100%;
  height: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 40px;
  box-sizing: border-box;
  .op-tab {
    width: 570px;
    height: 60px;
    background: rgba(0, 37, 104, 0.1);
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    box-sizing: border-box;
    .op-item {
      cursor: pointer;
      width: 130px;
      height: 40px;
      background: #ffffff;
      border: 1.15399px solid #f0f2f5;
      border-radius: 11.2062px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      letter-spacing: -0.177715px;
      color: rgba(0, 37, 104, 0.5);
      transition: all ease 0.3s;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .op-item:hover {
      background: #002568;
      border-radius: 11.2062px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: #ffffff;
      transition: all ease 0.3s;
    }
    .active {
      background: #002568;
      border-radius: 11.2062px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: #ffffff;
      transition: all ease 0.3s;
    }
  }
  .Withdraw {
    padding-top: 20px;
    transition: all ease 0.3s;
  }
  .stake {
    padding-top: 13px;
    transition: all ease 0.3s;
  }
  .Unstake {
    padding-top: 20px;
    transition: all ease 0.3s;
  }
  .Claim {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
    transition: all ease 0.3s;
    .claim-img {
      width: 93px;
      height: 93px;
      border-radius: 47px;
      background-color: #fafafa;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 54px;
      }
    }
    .reward-num {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 500;
      font-size: 22px;
      line-height: 33px;
      text-align: center; /* Zion1 */
      color: #002568;
      padding-top: 20px;
    }
    .reward-title {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      text-align: center; /* 浅 */
      color: rgba(0, 37, 104, 0.5);
      padding-bottom: 12px;
    }
  }
  .op-detail-item {
    .btn {
      width: 487px;
      height: 54px;
      background: #002568;
      border-radius: 15.9601px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 21.2802px;
      line-height: 26px;
      color: #ffffff;
      margin-bottom: 13px;
    }
    .balance {
      display: flex;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 17px; /* identical to box height */ /* 浅 */
      color: rgba(0, 37, 104, 0.5);
      padding-bottom: 12px;
    }
    .info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 13px;
      .title {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px; /* identical to box height */
        color: #002568;
        opacity: 0.99;
      }
      .value {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px; /* identical to box height */
        text-transform: capitalize;
        color: rgba(0, 37, 104, 0.5);
        opacity: 0.99;
      }
    }
    .input {
      width: 100%;
      height: 54px;
      background: #f1f6ff; /* Zion1 */
      border: 1.39583px solid #002568;
      border-radius: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 40px;
      box-sizing: border-box;
      margin-bottom: 10px;
      img {
        width: 46px;
      }
      input {
        flex: 1;
        border: none;
        background-color: rgba(0, 37, 104, 0);
        padding: 0 10px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 19px; /* Gray/500 */
        color: #667085;
      }
      .max-btn {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 22px; /* identical to box height */ /* Zion2 */
        color: #00a2b1;
        width: 41px;
      }
    }
  }
}
input:focus-visible {
  outline: none;
}
</style>
