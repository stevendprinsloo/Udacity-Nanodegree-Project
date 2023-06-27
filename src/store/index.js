import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    accessToken: null,
    user: null,
    reloadedPath: null,
    isReloaded: false,
    permissions: null,
  },
  getters: {
    getAccessToken: (state) => state.accessToken,
    getAuthUser: (state) => state.user,
    getReloadedPath: (state) => state.reloadedPath,
    getIsReloaded: (state) => state.isReloaded,
    getPermissions: (state) => state.permissions,
  },
  mutations: {
    setAccessToken(state, payload) {
      state.accessToken = payload;
    },
    setAuthUser(state, payload) {
      state.user = payload;
    },
    setAuthPermissions(state, payload) {
      state.permissions = payload;
    },
    setReloadedPath(state, payload) {
      state.reloadedPath = payload;
    },
    setIsReloaded(state, payload) {
      state.isReloaded = payload;
    },
  },
  actions: {
    async setAccessToken({ commit }, payload) {
      commit("setAccessToken", payload);
    },
    async setAuthUser({ commit }, payload) {
      commit("setAuthUser", payload);
    },
    async setReloadedPath({ commit }, payload) {
      commit("setReloadedPath", payload);
    },
    async setIsReloaded({ commit }, payload) {
      commit("setIsReloaded", payload);
    },
    async setAuthPermissions({ commit }, payload) {
      commit("setAuthPermissions", payload);
    },
  },
  modules: {},
});
