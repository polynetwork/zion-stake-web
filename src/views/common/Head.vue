<template>
  <div class="head">
    <div class="wallet-btn" @click="connect">
      {{ wallet.address ? formatLongText(wallet.address) : 'Connect Wallet' }}
    </div>
  </div>
</template>

<script>
import { createApp } from 'vue'
import App from '@/App.vue'
import { ChainId } from '@/utils/enums'
import { getWalletApi } from '@/utils/walletApi'
import format from '@/utils/formatters'
export default {
  name: 'HeadView',
  data() {
    return {
      ChainId: 0
    }
  },
  created() {
    this.wallets.forEach(async (wallet) => {
      createApp(App).use(await getWalletApi(wallet.name))
    })
  },
  computed: {
    wallets() {
      return this.$store.getters.wallets
    },
    wallet() {
      return this.$store.getters.wallets[0]
    },
    chains() {
      const arr = this.$store.getters.chains.filter(
        (chain) => chain.id !== ChainId.Poly
      )
      const obj = arr[2]
      arr.splice(2, 1)
      arr.push(obj)
      return arr
    },
    chainIdWithDefault() {
      return this.chainId ? this.chainId : this.chains[0].id
    },
    chain() {
      return this.$store.getters.getChain(this.chainIdWithDefault)
    }
  },
  methods: {
    formatLongText($text) {
      const headTailLength = 4
      return format.formatLongText($text, { headTailLength })
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
    }
  }
}
</script>
<style lang="scss" scoped>
.head {
  height: 94px;
  display: flex;
  justify-content: flex-end;
  padding: 40px 60px 0px;
  box-sizing: border-box;
  .wallet-btn {
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 14px 24px;

    width: 165px;
    height: 47px;

    /* Zion4 */

    background: #00fff0;
    border-radius: 12px;

    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;

    /* Zion1 */

    color: #002568;
  }
}
</style>
