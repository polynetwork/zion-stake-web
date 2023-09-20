/* eslint-disable */
import getStoreKey from '@/utils/getStoreKey';
import httpApi from '@/utils/httpApi';

export default {
  state: {
    transactionsMap: {},
    transactionMap: {},
  },
  getters: {
    getTransactions: state => ({ addressAndChainIds, page, pageSize, vary }) =>
      state.transactionsMap[getStoreKey({ addressAndChainIds, page, pageSize, vary })],
    getTransaction: state => hash => state.transactionMap[hash],
  },
  mutations: {
    setTransactions(state, { params, value }) {
      state.transactionsMap[getStoreKey(params)] = value
    },
    setTransaction(state, { key, value }) {
      state.transactionMap[key] = value
    },
  },
  actions: {
    async getTransactions({ commit }, { addressHexs, page, pageSize, vary }) {
      const result = await httpApi.getTransactions({ addressHexs, page, pageSize });
      commit('setTransactions', {
        params: { addressHexs, page, pageSize, vary },
        value: result,
      });
    },
    async getTransaction({ commit }, hash) {
      const result = await httpApi.getTransaction({ hash });
      commit('setTransaction', { key: hash, value: result });
    },
  },
};
