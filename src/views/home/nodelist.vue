<template>
  <div class="nodelist">
    <div class="head">
      <div class="left">
        <div class="title">List of nodes</div>
        <div class="line"></div>
        <div class="nodes">{{ nodesNum }} Nodes</div>
      </div>
      <div class="right">
        <div :class="btnFlag ? 'btn active' : 'btn'" @click="btnFlag = true">
          All
        </div>
        <div :class="!btnFlag ? 'btn active' : 'btn'" @click="btnFlag = false">
          My
        </div>
      </div>
    </div>
    <div class="table">
      <ElTable
        :data="nodelist"
        style="width: 100%"
        @row-click="openOp"
        @cell-click="toDetail"
      >
        <el-table-column prop="Name" label="Node name" width="180">
          <template #default="scope">
            <div class="table-name">
              <div class="node-rank">{{ scope.row.Rank }}</div>
              <img
                class="node-logo"
                :src="scope.row.Logo ? scope.row.Logo : defaultImg"
              />
              <span>{{
                scope.row.Name
                  ? scope.row.Name
                  : 'Node' + scope.row.ConsensusAddress.substr(0, 4)
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="TotalStake" label="Total Stake">
          <template #default="scope">
            {{ integerToDecimal(scope.row.TotalStake) }}
          </template>
        </el-table-column>
        <el-table-column prop="MyStake" label="Node Stake Amount">
          <template #default="scope">
            {{ integerToDecimal(scope.row.MyStake) }}
          </template>
        </el-table-column>
        <el-table-column prop="MyReward" label="My Reward">
          <template #default="scope">
            {{ integerToDecimal(scope.row.MyReward) }}
          </template>
        </el-table-column>
        <el-table-column prop="AnnualizedReward" label="Annualized reward">
          <template #default="scope">
            {{ formatNumber(scope.row.AnnualizedReward) }}%
          </template>
        </el-table-column>
        <el-table-column prop="StakingStatus" label="Staking status">
          <template #default="scope">
            <div class="table-progress">
              <ElProgress
                :percentage="scope.row.StakingStatus"
                class="el-progress"
                color="#00A2B1"
                :text-inside="true"
                :show-text="false"
              />
              <span>{{ formatNumber(scope.row.StakingStatus) }}%</span>
            </div>
          </template>
        </el-table-column>
      </ElTable>
    </div>
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
import { integerToDecimal } from '@/utils/convertors'
import format from '@/utils/formatters'
import { ElTable, ElProgress, ElDialog } from 'element-plus'
import { getWalletApi } from '@/utils/walletApi'
import Stake from '../common/StakeOp.vue'
export default {
  name: 'NodelistView',
  components: {
    ElTable,
    ElProgress,
    ElDialog,
    Stake
  },
  data() {
    return {
      btnFlag: true,
      currentConsensusAddress: '',
      currentName: '',
      userStakeVisible: false,
      defaultImg: require('@/assets/img/svg/tokenicon.svg')
    }
  },
  computed: {
    wallets() {
      return this.$store.getters.wallets
    },
    wallet() {
      return this.wallets[0]
    },
    getListOfNodesParams() {
      if (this.wallet && this.wallet.address) {
        return {
          addressHex: this.wallet.address,
          listType: 0,
          page: 1,
          pageSize: 10
        }
      } else {
        return {
          listType: 0,
          page: 1,
          pageSize: 10
        }
      }
    },
    nodesNum() {
      if (this.getListOfNodesParams) {
        const data = {
          listType: 0
        }
        const listdata = this.$store.getters.getListOfNodesMap(data)
        if (listdata) {
          return listdata.TotalNo
        } else {
          return 0
        }
      }
      return 0
    },
    allNodesList() {
      if (this.getListOfNodesParams) {
        const data = {
          listType: 0
        }
        const listdata = this.$store.getters.getListOfNodesMap(data)
        if (listdata) {
          return listdata.ListNodesData
        } else {
          return []
        }
      }
      return []
    },
    myNodesList() {
      if (this.getListOfNodesParams) {
        const data = {
          listType: 1
        }
        const listdata = this.$store.getters.getListOfNodesMap(data)
        if (listdata) {
          return listdata.ListNodesData
        } else {
          return []
        }
      }
      return []
    },
    nodelist() {
      if (this.allNodesList) {
        if (this.btnFlag) {
          return this.allNodesList
        } else {
          return this.myNodesList
        }
      } else {
        return []
      }
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
  watch: {
    wallet(value) {
      if (value) {
        this.$store.dispatch('getListOfNodes', this.getListOfNodesParams)
        const myValue = {
          addressHex: this.wallet.address,
          listType: 1,
          page: 1,
          pageSize: 10
        }
        this.$store.dispatch('getListOfNodes', myValue)
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.wallet && this.wallet.address) {
        this.$store.dispatch('getListOfNodes', this.getListOfNodesParams)
        const myValue = {
          addressHex: this.wallet.address,
          listType: 1,
          page: 1,
          pageSize: 10
        }
        this.$store.dispatch('getListOfNodes', myValue)
      } else {
        this.$store.dispatch('getListOfNodes', this.getListOfNodesParams)
      }
    },
    updateNode() {
      this.init()
      this.$store.dispatch('getStakeAmountInfo', this.getStakeAmountInfoParams)
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
    async openOp(row, column, event) {
      if (!this.wallet.address) {
        await this.connect()
      }
      if (column.label !== 'Node name') {
        this.currentConsensusAddress = row.ConsensusAddress
        this.currentName = row.Name
          ? row.Name
          : row.ConsensusAddress.substr(0, 4) + 'Node'
        this.$store.dispatch(
          'getStakeAmountInfo',
          this.getStakeAmountInfoParams
        )
        this.userStakeVisible = true
      }
    },
    toDetail(row, column, cell, event) {
      if (column.label === 'Node name') {
        this.$router.push({
          path: '/nodedetail',
          query: { consensusaddress: row.ConsensusAddress }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.nodelist {
  width: 100%;
  border: 1px solid #002568;
  border-radius: 20px;
  padding: 40px 30px;
  .head {
    margin-bottom: 25px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
      .title {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 22px;
        line-height: 27px;
        color: #002568;
      }
      .line {
        width: 1px;
        height: 28px;
        background-color: rgba(228, 230, 238, 1);
        margin: 0 10px;
      }
      .nodes {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        color: rgba(0, 37, 104, 0.5);
      }
    }
    .right {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .active {
        background: #00fff0;
        transition: all ease 0.3s;
      }
      .btn:hover {
        background: #00fff0;
        transition: all ease 0.3s;
      }
      .btn {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 34px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-size: 13.524px;
        line-height: 16px;
        color: #002568;
        transition: all ease 0.3s;
      }
      .btn:nth-child(1) {
        border-radius: 10.143px 0px 0px 10.143px;
      }
      .btn:nth-child(2) {
        border-radius: 0px 10.143px 10.143px 0px;
      }
    }
  }
  .table {
    height: fit-content;
    .el-table {
      tr {
        background-color: rgba(0, 0, 0, 0) !important;
      }
    }
    .table-name {
      display: flex;
      flex-direction: row;
      span {
        margin-left: 10px;
      }
    }
    .node-logo {
      width: 26px;
      border-radius: 13px;
      margin-left: 10px;
    }
    .table-progress {
      display: flex;
      flex-direction: row;
      .el-progress {
        width: 80%;
      }
      span {
        flex: 1;
        margin-left: 10px;
      }
    }
  }
}
</style>
<style>
.el-table {
  background-color: rgba(0, 0, 0, 0) !important;
}
.el-table tr {
  background-color: rgba(0, 0, 0, 0) !important;
}
.el-table th {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
