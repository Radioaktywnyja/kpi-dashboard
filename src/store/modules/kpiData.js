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
  async loadTeams ({ state, commit, rootState }) {
    await axios.get('items/teams', 
      { params: 
        { access_token: rootState.auth.user.token } 
      }).then(result => {
      commit('SET_TEAMS', result.data.data);
    }).catch(error => {
      throw new Error(`API ${error}`);
    });
  },
  async loadOwners ({ state, commit, rootState }) {
    await axios.get('items/owners', 
    { params: 
      { access_token: rootState.auth.user.token } 
    }).then(result => {
      commit('SET_OWNERS', result.data.data);
    }).catch(error => {
      throw new Error(`API ${error}`);
    });
  },
  async loadKpis ({ state, commit, rootState }) {
    await axios.get('items/kpis', 
    { params: 
      { access_token: rootState.auth.user.token } 
    }).then(result => {
      commit('SET_KPIS', result.data.data);
    }).catch(error => {
      throw new Error(`API ${error}`);
    });
  },
  async loadValues ({ state, commit, rootState }) {
    await axios.get('items/values', 
    { params: 
      { access_token: rootState.auth.user.token } 
    }).then(result => {
      commit('SET_VALUES', result.data.data);
    }).catch(error => {
      throw new Error(`API ${error}`);
    });
  },
  toggleLoading ({ commit }) {
    commit('SET_LOADING');
  }
}
