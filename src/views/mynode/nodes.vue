<template>
  <div class="mynodes">
    <div class="line"></div>
    <div class="content">
      <div class="newnode" @click="goPage('/mynode/register')">
        <img src="@/assets/img/svg/newnode.svg" />
        <span>Add an new node</span>
      </div>
      <div class="node" v-for="(item, index) in mynodelist" :key="index">
        <div class="title">
          <!-- <img
            :src="
              item.Logo !== '' ? item.logo : '@/assets/img/png/nodelogo.png'
            "
          /> -->
          <img src="@/assets/img/png/nodelogo.png" />
          <div class="name">{{ item.name }}</div>
        </div>
        <div class="address-item">
          <div class="addressname">ConsensusAddress</div>
          <div class="address">{{ formatLongText(item.ConsensusAddress) }}</div>
        </div>
        <div class="address-item">
          <div class="addressname">StakeAddress</div>
          <div class="address">{{ formatLongText(item.StakeAddress) }}</div>
        </div>
        <div class="address-item">
          <div class="addressname">SignerAddress</div>
          <div class="address">{{ formatLongText(item.SignerAddress) }}</div>
        </div>
        <div class="address-item">
          <div class="addressname">ProposalAddress</div>
          <div class="address">{{ formatLongText(item.ProposalAddress) }}</div>
        </div>
        <div class="manage">
          <div class="btn" @click="toDetail(item.ConsensusAddress)">
            <span>Manage</span>
            <img src="@/assets/img/svg/right.svg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import format from '@/utils/formatters'
export default {
  name: 'MyNodesView',
  data() {
    return {
      nodelist: [
        {
          ConsensusAddress: '0xf1c7203eF81Fb9663babd8516eBD30D33EE84eE8',
          StakeAddress: '0xf1c7203eF81Fb9663babd8516eBD30D33EE84eE8',
          SignerAddress: '0xf1c7203eF81Fb9663babd8516eBD30D33EE84eE8',
          ProposalAddress: '0xf1c7203eF81Fb9663babd8516eBD30D33EE84eE8',
          CommissionRate: '1',
          name: 'node111',
          LockStatus: 1,
          Jailed: true,
          TotalStake: 999999,
          SelfStake: 100000,
          Website: '',
          Twitter: '',
          Discord: '',
          Mail: '',
          Logo: '',
          Desc: 'new node'
        },
        {
          ConsensusAddress: '0xf1c7203eF81Fb9663babd8516eBD30D33EE84eE8',
          StakeAddress: '0xf1c7203eF81Fb9663babd8516eBD30D33EE84eE8',
          SignerAddress: '0xf1c7203eF81Fb9663babd8516eBD30D33EE84eE8',
          ProposalAddress: '0xf1c7203eF81Fb9663babd8516eBD30D33EE84eE8',
          CommissionRate: '1',
          name: 'node222',
          LockStatus: 1,
          Jailed: true,
          TotalStake: 999999,
          SelfStake: 100000,
          Website: '',
          Twitter: '',
          Discord: '',
          Mail: '',
          Logo: '',
          Desc: 'new node'
        },
        {
          ConsensusAddress: '0xf1c7203eF81Fb9663babd8516eBD30D33EE84eE8',
          StakeAddress: '0xf1c7203eF81Fb9663babd8516eBD30D33EE84eE8',
          SignerAddress: '0xf1c7203eF81Fb9663babd8516eBD30D33EE84eE8',
          ProposalAddress: '0xf1c7203eF81Fb9663babd8516eBD30D33EE84eE8',
          CommissionRate: '1',
          name: 'node222',
          LockStatus: 1,
          Jailed: true,
          TotalStake: 999999,
          SelfStake: 100000,
          Website: '',
          Twitter: '',
          Discord: '',
          Mail: '',
          Logo: '',
          Desc: 'new node'
        }
      ]
    }
  },
  computed: {
    wallets() {
      return this.$store.getters.wallets
    },
    wallet() {
      return this.wallets[0]
    },
    getMyNodesParams() {
      if (this.wallet && this.wallet.address) {
        return {
          stakeAddress: this.wallet.address,
          pageSize: 10,
          pageNo: 1
        }
      }
      return null
    },
    mynodelist() {
      if (this.myNodesData) {
        return this.myNodesData.MyValidatorData
      }
      return []
    },
    myNodesData() {
      if (this.getMyNodesParams) {
        const data = {
          stakeAddress: this.wallet.address
        }
        return this.$store.getters.getMyNodesMap(data)
      }
      return null
    }
  },
  mounted() {
    this.$store.dispatch('getMyNodes', this.getMyNodesParams)
  },
  watch: {
    getMyNodesParams(value) {
      if (value) {
        this.$store.dispatch('getMyNodes', value)
      }
    }
  },
  methods: {
    formatLongText($text) {
      return format.formatLongText($text)
    },
    goPage($url) {
      this.$router.push($url)
    },
    toDetail($address) {
      this.$router.push({
        path: '/mynode/detail',
        query: { consensusaddress: $address }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mynodes {
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
  .content {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .newnode {
      cursor: pointer;
      width: 313px;
      height: 275px;
      border: 1.6806px dashed rgba(0, 37, 104, 0.5);
      border-radius: 18.4866px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-bottom: 25px;
      margin-right: 25px;
      img {
        width: 50px;
        margin-bottom: 15px;
      }
      span {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 13.4448px;
        line-height: 16px;
        color: rgba(0, 37, 104, 0.3);
      }
    }
    .node {
      width: 313px;
      height: 275px;
      border: 1px solid #002568;
      border-radius: 18.4866px;
      box-sizing: border-box;
      margin-bottom: 25px;
      margin-right: 25px;
      .title {
        display: flex;
        border-bottom: 0.840301px solid #d8d9e0;
        padding: 17px 20px;
        align-items: center;
        margin-bottom: 20px;
        img {
          width: 42px;
          margin-right: 10px;
        }
        .name {
          font-family: 'Poppins';
          font-style: normal;
          font-weight: 500;
          font-size: 10.7166px;
          line-height: 16px;
          display: flex;
          align-items: center;
          color: #002568;
        }
      }
      .address-item {
        display: flex;
        flex-direction: row;
        padding: 0 20px;
        justify-content: space-between;
        margin-bottom: 12px;
        .addressname {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 17px;
          text-transform: capitalize;
          color: #002568;
        }
        .address {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 17px;
          color: rgba(0, 37, 104, 0.5);
        }
      }
      .manage {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: 12px 20px 0;
        box-sizing: border-box;
        .btn {
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 8.82812px 21.1875px;
          gap: 8.83px;
          width: 110.44px;
          height: 34.66px;
          border: 1px solid #002568;
          border-radius: 10.5938px;
          box-sizing: border-box;
          justify-content: flex-end;
          span {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 500;
            font-size: 14.125px;
            line-height: 17px;
            color: #002568;
          }
          img {
            width: 6px;
          }
        }
      }
    }
  }
}
</style>
