/* eslint-disable */
import getStoreKey from '@/utils/getStoreKey';
import httpApi from '@/utils/httpApi';

export default {
  state: {
    stakeAmountInfoMap: {},
  },
  getters: {
    getStakeAmountInfo: state => ({ stakeAddress, consensusAddress }) =>
      state.stakeAmountInfoMap[getStoreKey({ stakeAddress, consensusAddress })],
  },
  mutations: {
    setStakeAmountInfo(state, { params, value }) {
      state.stakeAmountInfoMap[getStoreKey(params)] = value
    },
  },
  actions: {
    async getStakeAmountInfo({ commit }, { stakeAddress, consensusAddress }) {
      const data = {
        StakeAddress: stakeAddress,
        ConsensusAddress: consensusAddress
      }
      const result = await httpApi.getStakeAmountInfo(data);
      commit('setStakeAmountInfo', {
        params: { stakeAddress, consensusAddress },
        value: result,
      });
    },
  },
};
