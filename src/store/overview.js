/* eslint-disable */
import httpApi from '@/utils/httpApi';

export default {
  state: {
    overviewData: {},
  },
  getters: {
    getOverviewData: state => () =>
      state.overviewData,
  },
  mutations: {
    setOverviewData(state, { value }) {
      state.overviewData = value
    },
  },
  actions: {
    async getOverviewData({ commit }) {
      const result = await httpApi.getOverview();
      commit('setOverviewData', {
        value: result,
      });
    },
  },
};
