/* eslint-disable */
import getStoreKey from '@/utils/getStoreKey';
import httpApi from '@/utils/httpApi';

export default {
  state: {
    nodeDetailMap: {},
  },
  getters: {
    getNodeDetail: state => ({ addressHex }) =>
      state.nodeDetailMap[getStoreKey({ addressHex })],
  },
  mutations: {
    setNodeDetail(state, { params, value }) {
      state.nodeDetailMap[getStoreKey(params)] = value
    },
  },
  actions: {
    async getNodeDetail({ commit }, { addressHex, pageSize, pageNo }) {
      const data = {
        ConsensusAddress: addressHex,
        PageSize: pageSize,
        PageNo: pageNo
      }
      const result = await httpApi.getNodeDetail(data);
      commit('setNodeDetail', {
        params: { addressHex },
        value: result,
      });
    },
  },
};
