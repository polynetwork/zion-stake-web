/* eslint-disable */
import getStoreKey from '@/utils/getStoreKey'
import httpApi from '@/utils/httpApi'

export default {
  state: {
    myNodesMap: {}
  },
  getters: {
    getMyNodesMap:
      (state) =>
      ({ stakeAddress }) =>
        state.myNodesMap[getStoreKey({ stakeAddress })]
  },
  mutations: {
    setMyNodes(state, { params, value }) {
      state.myNodesMap[getStoreKey(params)] = value
    }
  },
  actions: {
    async getMyNodes({ commit }, { stakeAddress, pageSize, pageNo }) {
      const data = {
        StakeAddress: stakeAddress,
        PageSize: pageSize,
        PageNo: pageNo
      }
      const result = await httpApi.getMyNodes(data)
      commit('setMyNodes', {
        params: { stakeAddress },
        value: result
      })
    }
  }
}
