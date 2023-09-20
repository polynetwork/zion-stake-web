/* eslint-disable */
import getStoreKey from '@/utils/getStoreKey'
import { getWalletApi } from '@/utils/walletApi'

export default {
  state: {
    balanceMap: {}
  },
  getters: {
    getBalance:
      (state) =>
      ({ chainId, address }) =>
        state.balanceMap[getStoreKey({ chainId, address })]
  },
  mutations: {
    setBalance(state, { params, value }) {
      state.balanceMap[getStoreKey(params)] = value
    }
  },
  actions: {
    async getBalance({ getters, commit }, { chainId, address }) {
      const wallet = getters.getChainConnectedWallet(chainId)
      if (!wallet) {
        return
      }
      const walletApi = await getWalletApi(wallet.name)
      const balance = await walletApi.getBalance({
        address
      })

      const oldValue = getters.getBalance({ chainId, address })
      if (oldValue !== balance) {
        commit('setBalance', {
          params: { chainId, address },
          value: balance
        })
      }
    }
  }
}
