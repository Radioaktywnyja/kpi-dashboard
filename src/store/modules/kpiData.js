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
  },
  ADD_TEAMS (state, data) {
    state.teams.push(data)
  },
  ADD_OWNERS (state, data) {
    state.owners.push(data)
  },
  ADD_KPIS (state, data) {
    state.kpis.push(data)
  },
  ADD_VALUES (state, data) {
    state.values.push(data)
  },
  ADD_MULTIPLE_TEAMS (state, data) {
    state.teams.push(...data)
  },
  ADD_MULTIPLE_OWNERS (state, data) {
    state.owners.push(...data)
  },
  ADD_MULTIPLE_KPIS (state, data) {
    state.kpis.push(...data)
  },
  ADD_MULTIPLE_VALUES (state, data) {
    state.values.push(...data)
  },
}

// actions
export const actions = {
  async loadState({ commit, rootState }, payload) {
    const target = 'items/' + payload;
    const mutation = 'SET_' + payload.toUpperCase();
    await axios.get(target, 
      { params: 
        { access_token: rootState.auth.user.token } 
      }).then(result => {
      commit(mutation, result.data.data);
    }).catch(error => {
      throw new Error(`API ${error}`);
    });
  },
  async addState ({ commit, rootState }, payload) {
    let mutation = '';
    const target = 'items/' + payload.name;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + rootState.auth.user.token 
    }
    await axios.post(target, payload.data, { headers })
      .then(result => {
        if (Array.isArray(result.data.data)) {
          mutation = 'ADD_MULTIPLE_' + payload.name.toUpperCase();
        } else {
          mutation = 'ADD_' + payload.name.toUpperCase();
        }
        commit(mutation, result.data.data);
      }).catch(error => {
        throw new Error(`API ${error}`);
      });
  },
  toggleLoading ({ commit }) {
    commit('SET_LOADING');
  }
}