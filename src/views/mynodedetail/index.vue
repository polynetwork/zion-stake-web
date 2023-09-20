<template>
  <div class="mynodedetail">
    <div class="path">
      <img src="@/assets/img/svg/left.svg" />
      <span class="back" @click="goPage('/mynode')">My node</span>
      <div class="pathline"></div>
      <span class="registerpath">Basic information</span>
    </div>
    <div class="line"></div>
    <div class="title-wrapper">
      {{ nodeDetail }}
      <div class="title" v-if="nodeDetail">
        {{
          nodeDetail.NodeDetailData.Name
            ? nodeDetail.NodeDetailData.Name
            : nodeDetail.NodeDetailData.ConsensusAddressnodeDetail.NodeDetailData.substr(
                0,
                4
              )
        }}
      </div>
      <div class="tab-wrapper">
        <div class="tab">Basic info</div>
        <div class="tab">Stake management</div>
      </div>
    </div>
    <basic :nodeDetail="nodeDetail" @update="updateNode()"></basic>
  </div>
</template>

<script>
import basic from './basic.vue'
export default {
  name: 'NodeDetailView',
  components: {
    basic
  },
  computed: {
    wallets() {
      return this.$store.getters.wallets
    },
    wallet() {
      return this.wallets[0]
    },
    currentConsensusAddress() {
      if (this.$route.query.consensusaddress) {
        return this.$route.query.consensusaddress
      }
      return null
    },
    getNodeDetailParams() {
      if (this.currentConsensusAddress) {
        return {
          addressHex: this.currentConsensusAddress,
          pageSize: 10,
          pageNo: 1
        }
      }
      return null
    },
    nodeDetail() {
      if (this.getNodeDetailParams) {
        return this.$store.getters.getNodeDetail({
          addressHex: this.currentConsensusAddress
        })
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
  mounted() {
    this.$store.dispatch('getNodeDetail', this.getNodeDetailParams)
    this.$store.dispatch('getStakeAmountInfo', this.getStakeAmountInfoParams)
  },
  watch: {
    getStakeAmountInfoParams(value) {
      if (value) {
        this.$store.dispatch('getStakeAmountInfo', value)
      }
    }
  },
  methods: {
    goPage($url) {
      this.$router.push($url)
    },
    updateNode() {
      this.$store.dispatch('getNodeDetail', this.getNodeDetailParams)
      this.$store.dispatch('getStakeAmountInfo', this.getStakeAmountInfoParams)
    }
  }
}
</script>
<style lang="scss" scoped>
.mynodedetail {
  width: 100%;
  min-height: 100vh;
  padding: 0 60px;
  box-sizing: border-box;
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
}
</style>
