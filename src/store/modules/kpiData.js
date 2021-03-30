import axios from 'axios'

// state
export const state = {
  teams: [],
  owners: [],
  kpis: [],
  values: [],
  loading: false
}

// getters
export const getters = {
  getKpiByTeam: (state) => (team_id) => {
    return state.kpis.filter(kpi => kpi.team_id == team_id)
  },
  getKpiById: (state) => (id) => {
    return state.kpis.find(kpi => kpi.id == id)
  },
  getValuesByKpi: (state) => (kpi_id) => {
    return state.values.filter(val => val.kpi_id == kpi_id)
  },
  getOwnerById: (state) => (id) => {
    return state.owners.find(owner => owner.id == id)
  }
}

// mutations
export const mutations = {
  SET_TEAMS (state, data) {
    state.teams = data
  },
  SET_OWNERS (state, data) {
    state.owners = data
  },
  SET_KPIS (state, data) {
    state.kpis = data
  },
  SET_VALUES (state, data) {
    state.values = data
  },
  SET_LOADING (state) {
    state.loading = !state.loading
  }
}

// actions
export const actions = {
  async loadTeams ({ commit }) {
    await axios.get('http://192.168.0.108:8055/items/teams?access_token=token123').then(result => {
      commit('SET_TEAMS', result.data.data);
    }).catch(error => {
      throw new Error(`API ${error}`);
    });
  },
  async loadOwners ({ commit }) {
    await axios.get('http://192.168.0.108:8055/items/owners?access_token=token123').then(result => {
      commit('SET_OWNERS', result.data.data);
    }).catch(error => {
      throw new Error(`API ${error}`);
    });
  },
  async loadKpis ({ commit }) {
    await axios.get('http://192.168.0.108:8055/items/kpis?access_token=token123').then(result => {
      commit('SET_KPIS', result.data.data);
    }).catch(error => {
      throw new Error(`API ${error}`);
    });
  },
  async loadValues ({ commit }) {
    await axios.get('http://192.168.0.108:8055/items/values?access_token=token123').then(result => {
      commit('SET_VALUES', result.data.data);
    }).catch(error => {
      throw new Error(`API ${error}`);
    });
  },
  toggleLoading ({ commit }) {
    commit('SET_LOADING');
  }
}
