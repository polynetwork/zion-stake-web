/* eslint-disable */
import getStoreKey from '@/utils/getStoreKey';
import httpApi from '@/utils/httpApi';

export default {
  state: {
    listOfNodesMap: {},
  },
  getters: {
    getListOfNodesMap: state => ({ listType }) =>
      state.listOfNodesMap[getStoreKey({ listType })],
  },
  mutations: {
    setListOfNodes(state, { params, value }) {
      state.listOfNodesMap[getStoreKey(params)] = value
    },
  },
  actions: {
    async getListOfNodes({ commit }, { addressHex, listType, page, pageSize, }) {
      const data = {
        StakeAddress: addressHex,
        ListType: listType,
        PageSize: pageSize,
        PageNo: page
      }
      const result = await httpApi.getListOfNodes(data);
      commit('setListOfNodes', {
        params: { listType },
        value: result,
      });
    },
  },
};
