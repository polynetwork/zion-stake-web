<template>
  <div class="register">
    <div class="path">
      <img src="@/assets/img/svg/left.svg" />
      <span class="back" @click="goPage('/mynode')">My Node</span>
      <div class="pathline"></div>
      <span class="registerpath">New node registration </span>
    </div>
    <div class="line"></div>
    <div class="title">New node registration</div>
    <div class="initial">
      <div class="initial-title">Initial stake</div>
      <div class="input">
        <img src="@/assets/img/svg/tokenicon.svg" />
        <input v-model="amount" placeholder="0.00" type="number" />
        <div class="max-btn">MAX</div>
      </div>
      <div class="balance">
        <span>Balance {{ Number(balance).toFixed(2) }} Zion</span>
      </div>
    </div>
    <div class="distribution">
      <div class="distribution-title">Distribution ratio</div>
      <div class="startpoint"></div>
      <el-slider
        v-model="ratio"
        :step="1"
        :marks="marks"
        max="100"
        placeholder="Custom"
      />
      <div class="range">
        <div class="item" @click="getRatio(0)">0%</div>
        <div class="item" @click="getRatio(20)">20%</div>
        <div class="item" @click="getRatio(40)">40%</div>
        <div class="item" @click="getRatio(60)">60%</div>
        <div class="item" @click="getRatio(80)">80%</div>
        <div class="item" @click="getRatio(100)">100%</div>
        <div class="item">
          <input type="number" v-model="ratio" placeholder="Custom" max="100" />
        </div>
      </div>
    </div>
    <div class="wallets">
      <div class="wallet">
        <div class="wallet-name">consensusAddress</div>
        <input v-model="consensusAddress" placeholder="Type in" />
      </div>
      <div class="wallet">
        <div class="wallet-name">stakeAddress</div>
        <input v-model="stakeAddress" placeholder="Type in" disabled />
      </div>
      <div class="wallet">
        <div class="wallet-name">proposalAddress</div>
        <input v-model="proposalAddress" placeholder="Type in" />
      </div>
      <div class="wallet">
        <div class="wallet-name">votingAddress</div>
        <input v-model="votingAddress" placeholder="Type in" />
      </div>
    </div>
    <div class="register-btn-wrapper">
      <div class="register-btn" @click="registerNode()">Register</div>
    </div>
  </div>
</template>

<script>
import { getWalletApi } from '@/utils/walletApi'

export default {
  name: 'RegisterView',
  components: {},
  data() {
    return {
      ChainId: 0,
      amount: 0,
      ratio: '',
      consensusAddress: '',
      proposalAddress: '',
      votingAddress: '',
      marks: {
        0: '0',
        10: '',
        20: '',
        30: '',
        40: '',
        50: '',
        60: '',
        70: '',
        80: '',
        90: '',
        100: '100%'
      }
    }
  },
  computed: {
    wallets() {
      return this.$store.getters.wallets
    },
    wallet() {
      return this.$store.getters.wallets[0]
    },
    stakeAddress() {
      return this.wallet.address
    },
    getBalanceParams() {
      if (this.wallet) {
        return { chainId: 3, address: this.wallet.address }
      }
      return null
    },
    balance() {
      return this.$store.getters.getBalance(this.getBalanceParams)
    }
  },
  created() {
    this.$store.dispatch('getBalance', this.getBalanceParams)
  },
  watch: {
    getBalanceParams(value) {
      this.$store.dispatch('getBalance', value)
    },
    wallet(value) {
      this.stakeAddress = value.address
    }
  },
  methods: {
    goPage($url) {
      this.$router.push($url)
    },
    getRatio($val) {
      this.ratio = Number($val)
    },
    async registerNode() {
      const walletApi = await getWalletApi(this.wallet.name)
      const transactionHash = await walletApi.registerNode({
        stakeAddress: this.wallet.address,
        chainId: 3,
        consensusAddress: this.consensusAddress,
        signerAddress: this.votingAddress,
        proposalAddress: this.proposalAddress,
        commission: this.ratio,
        desc: '',
        amount: this.amount
      })
      console.log(transactionHash)
    }
  }
}
</script>
<style scoped lang="scss">
.register {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  height: calc(100vh - 93px);
  .path {
    height: 26px;
    display: flex;
    flex-direction: row;
    align-items: center;
    img {
      width: 5px;
      margin-right: 8px;
    }
    .back {
      cursor: pointer;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      color: #002568;
    }
    .pathline {
      background-color: #e4e6ee;
      height: 100%;
      width: 1px;
      margin: 0 10px;
    }
    .registerpath {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      color: rgba(0, 37, 104, 0.5);
    }
  }
  .line {
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
    margin-bottom: 40px;
  }
  .title {
    width: 100%;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 27px; /* identical to box height */
    color: #242525;
    padding-bottom: 40px;
  }
  .initial {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    margin-bottom: 20px;
    width: 100%;
    .initial-title {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px; /* Gray/700 */
      color: #344054;
      margin-bottom: 12px;
    }
    .input {
      width: 100%;
      height: 60px;
      background: #f1f6ff; /* Zion1 */
      border: 1.39583px solid #002568;
      border-radius: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
      img {
        width: 42px;
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
        width: 42px;
      }
    }
  }
  .distribution {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    margin-bottom: 20px;
    width: 100%;
    .distribution-title {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px; /* Gray/700 */
      color: #344054;
      margin-bottom: 24px;
    }
    position: relative;
    .startpoint {
      position: absolute;
      left: -12px;
      top: 48px;
      width: 24px;
      height: 24px;
      background: #002568;
      border: 2px solid #ffffff;
      border-radius: 12px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16);
      box-sizing: border-box;
      z-index: 1;
    }
    .range {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .item {
        cursor: pointer;
        width: 73px;
        height: 35px;
        border: 1px solid rgba(0, 37, 104, 0.5);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        input {
          background-color: rgba(0, 37, 104, 0);
          width: 100%;
          border: none;
          padding: 10px;
          text-align: center;
        }
      }
    }
  }
  .wallets {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    .wallet {
      width: 45%;
      display: flex;
      flex-direction: column;
      align-items: baseline;
      margin-bottom: 20px;
      .wallet-name {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        display: flex;
        align-items: center; /* Gray/700 */
        color: #344054;
        margin-bottom: 12px;
      }
      input {
        width: 100%;
        height: 43px;
        background: #f1f6ff; /* Zion1 */
        border: 1.39583px solid #002568;
        border-radius: 12px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 19px; /* Gray/500 */
        color: #667085;
        padding: 12px 20px;
        box-sizing: border-box;
      }
    }
  }
  .register-btn-wrapper {
    width: 100%;
    flex: 1;
    position: relative;
    .register-btn {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 10px 24px;
      gap: 10px;
      position: absolute;
      width: 463px;
      height: 48px;
      left: 50%;
      // transform: translateX(-50%);
      bottom: 50px;
      background: #002568;
      border-radius: 12px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: #ffffff;
      transform: translateX(-50%);
    }
  }
}
</style>
<style>
.el-slider__bar {
  z-index: 1;
}
.el-slider__button {
  width: 24px;
  height: 24px;
  background: #002568;
  border: 2px solid #ffffff;
}
.el-slider__bar {
  background-color: rgba(0, 37, 104, 1);
}
.el-slider__marks-text {
  top: -50px;
}
.el-slider__runway {
  width: 100%;
  flex: 100%;
}
.el-input__wrapper {
  box-shadow: none;
  background-color: rgba(0, 37, 104, 0);
}
.el-input__wrapper:hover {
  box-shadow: none;
}
.el-input__wrapper:focus {
  box-shadow: none;
  outline: none;
}
.el-input__wrapper.is-focus {
  box-shadow: none;
  outline: none;
}
.el-input {
  outline: none;
  width: 99px;
  height: 35px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: rgba(0, 37, 104, 0.5);
  border: 1px solid rgba(0, 37, 104, 0.5);
  border-radius: 12px;
}
.el-input-number {
  position: absolute;
  right: 0;
  top: 160px;
}
.el-input-number > span {
  display: none;
}
.el-input-number > .el-input > .el-input__wrapper {
  padding: 0;
}
.el-input__inner {
  content: 'Custom';
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input:focus {
  outline: none;
}
</style>
