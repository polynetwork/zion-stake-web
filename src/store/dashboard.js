/* eslint-disable */
import getStoreKey from '@/utils/getStoreKey';
import httpApi from '@/utils/httpApi';

export default {
  state: {
    dashboardMap: {},
  },
  getters: {
    getDashboard: state => ({ addressHex }) =>
      state.dashboardMap[getStoreKey({ addressHex })],
  },
  mutations: {
    setDashboard(state, { params, value }) {
      state.dashboardMap[getStoreKey(params)] = value
    },
  },
  actions: {
    async getDashboard({ commit }, { addressHex }) {
      const data = {
        StakeAddress: addressHex,
      }
      const result = await httpApi.getDashboard(data);
      commit('setDashboard', {
        params: { addressHex },
        value: result,
      });
    },
  },
};
