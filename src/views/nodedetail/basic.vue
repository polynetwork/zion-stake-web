<template>
  <div class="NodeBasicView">
    <div class="title">Node Detail</div>
    <div class="content">
      <div class="left">
        <img :src="nodeDetailData ? nodeDetailData.Logo : ''" />
        <div class="stakeBtn" @click="openOp()">Stake Now</div>
      </div>
      <div class="middle" v-if="nodeDetailData">
        <div class="item">
          <span>Name</span>
          <div class="value">
            {{
              nodeDetailData.Name
                ? nodeDetailData.Name
                : 'Node' + nodeDetailData.ConsensusAddress.substr(0, 4)
            }}
          </div>
        </div>
        <div class="item">
          <span>Status</span>
          <div class="value">{{ getNodeStatus(nodeDetailData.Status) }}</div>
        </div>
        <div class="item">
          <span>Rank</span>
          <div class="value">{{ nodeDetailData.Rank }}</div>
        </div>
        <div class="item">
          <span>Total amount</span>
          <div class="value">
            {{ integerToDecimal(nodeDetailData.TotalStake) }}
          </div>
        </div>
        <div class="item">
          <span>Node stake</span>
          <div class="value">
            {{ integerToDecimal(nodeDetailData.SelfStake) }}
          </div>
        </div>
        <div class="item">
          <span>User stake</span>
          <div class="value">
            {{ integerToDecimal(nodeDetailData.UserStake) }}
          </div>
        </div>
        <div class="item">
          <span>Social media</span>
          <div class="value social">
            <img
              v-if="nodeDetailData.Discord"
              @click="openUrl(nodeDetailData.Discord)"
              src="@/assets/img/svg/discord.svg"
            />
            <img
              v-if="nodeDetailData.Twitter"
              @click="openUrl(nodeDetailData.Twitter)"
              src="@/assets/img/svg/twitter.svg"
            />
          </div>
        </div>
        <div class="item">
          <span>Ratio</span>
          <div class="value">
            {{ percentFormat(nodeDetailData.CommissionRate) }}
          </div>
        </div>
        <div class="item">
          <span>Address</span>
          <div
            class="value url"
            @click="
              openUrl(
                'http://explorer.zion.network/testnet/address/' +
                  nodeDetailData.ConsensusAddress
              )
            "
          >
            {{ formatLongText(nodeDetailData.ConsensusAddress) }}
          </div>
        </div>
        <div class="item">
          <span>Website</span>
          <div class="value">
            <a :href="nodeDetailData.Website" target="_blank">{{
              nodeDetailData.Website
            }}</a>
          </div>
        </div>
        <div class="item">
          <span>Desc</span>
          <div class="value desc">
            {{ nodeDetailData.Desc }}dfssl hfdkls jkl;faj sfhd sjkfghd sjkhg
            jkdshgf kdfs hgkhdfs dfssl hfdkls jkl;faj sfhd sjkfghd sjkhg jkdshgf
            kdfs hgkhdfs dfssl hfdkls jkl;faj sfhd sjkfghd sjkhg jkdshgf kdfs
            hgkhdfs
          </div>
        </div>
      </div>
      <div class="subline"></div>
      <div class="right">
        <Pie :stakeData="stakeData"></Pie>
      </div>
    </div>
    <div class="line"></div>
    <el-dialog
      v-model="userStakeVisible"
      :title="currentName"
      :destroy-on-close="true"
    >
      <Stake
        :stakeInfo="StakeAmountInfo"
        :consensusAddress="currentConsensusAddress"
        @update="updateNode()"
      ></Stake>
    </el-dialog>
  </div>
</template>

<script>
import Pie from '@/views/nodedetail/pie.vue'
import { integerToDecimal } from '@/utils/convertors'
import format from '@/utils/formatters'
import { ElDialog } from 'element-plus'
import Stake from '@/views/common/StakeOp.vue'
import { getWalletApi } from '@/utils/walletApi'

export default {
  name: 'NodeBasicView',
  props: {
    nodeDetail: Object
  },
  data() {
    return {
      userStakeVisible: false,
      currentConsensusAddress: ''
    }
  },
  computed: {
    wallets() {
      return this.$store.getters.wallets
    },
    wallet() {
      return this.wallets[0]
    },
    nodeDetailData() {
      if (this.nodeDetail) {
        return this.nodeDetail.NodeDetailData
      }
      return null
    },
    stakeData() {
      if (this.nodeDetailData) {
        const ret = {
          userStake: this.pureIntegerToDecimal(this.nodeDetailData.UserStake),
          totalStake: this.pureIntegerToDecimal(this.nodeDetailData.TotalStake),
          nodeStake: this.pureIntegerToDecimal(this.nodeDetailData.SelfStake)
        }
        return ret
      }
      return null
    },
    getStakeAmountInfoParams() {
      if (this.wallet && this.wallet.address && this.currentConsensusAddress) {
        return {
          stakeAddress: this.wallet.address,
          consensusAddress: this.currentConsensusAddress
        }
      }
      return null
    },
    StakeAmountInfo() {
      if (this.getStakeAmountInfoParams) {
        return this.$store.getters.getStakeAmountInfo(
          this.getStakeAmountInfoParams
        )
      }
      return null
    }
  },
  components: {
    Pie,
    ElDialog,
    Stake
  },
  methods: {
    openUrl($val) {
      window.open($val)
    },
    formatLongText($text) {
      const headTailLength = 8
      return format.formatLongText($text, { headTailLength })
    },
    percentFormat($val) {
      if ($val) {
        return integerToDecimal($val, 2) + '%'
      } else {
        return '--'
      }
    },
    pureIntegerToDecimal($val) {
      if ($val) {
        return integerToDecimal($val, 18)
      } else {
        return 0
      }
    },
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
    },
    getNodeStatus($val) {
      let ret
      switch ($val) {
        case 0:
          ret = 'Error'
          break
        case 1:
          ret = 'Validator'
          break
        case 2:
          ret = 'Consensus'
          break
        case 3:
          ret = 'Canceled'
          break
        default:
          break
      }
      return ret
    },
    async connect() {
      const wallet = this.wallets[0]
      console.log(wallet)
      if (wallet.installed) {
        const walletApi = await getWalletApi(wallet.name)
        if (!wallet.connected) {
          await walletApi.install()
          await walletApi.connect()
          this.$store.dispatch('setChainSelectedWallet', {
            chainId: 3,
            walletName: wallet.name
          })
        } else {
          await walletApi.disConnect()
        }
      } else {
        console.log(1)
        window.open(wallet.downloadUrl)
      }
      console.log(wallet)
    },
    async openOp() {
      if (!this.wallet.address) {
        await this.connect()
      }
      this.currentConsensusAddress = this.$route.query.consensusaddress
      this.currentName = this.nodeDetailData.Name
        ? this.nodeDetailData.Name
        : 'Node' + this.nodeDetailData.ConsensusAddress.substr(0, 4)
      this.userStakeVisible = true
    },
    updateNode() {
      this.$emit('update')
    }
  }
}
</script>
<style lang="scss" scoped>
.NodeBasicView {
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  .title {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 27px;
    /* identical to box height */
    color: #002568;
    padding-bottom: 40px;
  }
  .line {
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
    margin: 40px 0;
  }
  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    .left {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-right: 22px;
      img {
        width: 136px;
        height: 136px;
        background: #ffffff;
        border-radius: 79.8027px;
      }
      .stakeBtn {
        margin-top: 25px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 14.125px;
        line-height: 17px;
        color: #ffffff;
        width: 117px;
        height: 34.66px;
        background: #002568;
        border-radius: 10.5938px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .middle {
      width: 336px;
      display: flex;
      flex-direction: column;
      .item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 9px;
        span {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 17px;
          color: #002568;
          opacity: 0.99;
          margin-right: 60px;
        }
        .desc {
          display: flex;
          flex-wrap: wrap;
          word-break: break-all;
          text-align: left;
        }
        .value {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 17px;
          color: rgba(0, 37, 104, 0.5);
          img {
            width: 12px;
            cursor: pointer;
            margin-left: 8px;
          }
        }
        .url {
          cursor: pointer;
        }
      }
    }
    .subline {
      width: 1px;
      height: 229px;
      background: rgba(0, 37, 104, 0.2);
      margin: 0 43px;
    }
  }
}
</style>
