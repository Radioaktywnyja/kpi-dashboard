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
  getValueById: (state) => (id) => {
    return state.values.find(value => value.id == id)
  },
  getOwnerById: (state) => (id) => {
    return state.owners.find(owner => owner.id == id)
  },
  getTeamById: (state) => (id) => {
    return state.teams.find(team => team.id == id)
  },
}

// mutations
export const mutations = {
  SET_ITEMS (state, {item, data}) {
    state[item] = data
  },
  SET_LOADING (state) {
    state.loading = !state.loading
  },
  ADD_ITEMS (state, {item, data}) {
    state[item].push(data)
  },
  ADD_MULTIPLE_ITEMS (state, {item, data}) {
    state[item].push(...data)
  },
  UPDATE_ITEMS (state, {item, data}) {
    state[item] = state[item].map(obj => {
      if (obj.id === data.id) {
        return Object.assign({}, obj, data)
      }
      return obj
    })
  },
  DELETE_ITEMS (state, {item, data}) {
    let index = state[item].findIndex(obj => obj.id == data)
    state[item].splice(index, 1)
  },
}

// actions
export const actions = {
  async initState({ commit, rootState }) {
    const items = ['teams', 'owners', 'kpis', 'values'];
    items.map(async stateName => {
      let target = 'items/' + stateName;
      await axios.get(target, 
        { params: 
          { access_token: rootState.auth.user.token } 
        }).then(result => {
          commit('SET_ITEMS', {item: stateName, data: result.data.data});
        }).catch(error => {
          throw new Error(`API ${error}`);
        });
    });
  },
  // async loadState({ commit, rootState }, payload) {
  //   const target = 'items/' + payload;
  //   await axios.get(target, 
  //     { params: 
  //       { access_token: rootState.auth.user.token } 
  //     }).then(result => {
  //       commit('SET_ITEMS', {item: payload, data: result.data.data});
  //     }).catch(error => {
  //       throw new Error(`API ${error}`);
  //     });
  // },
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
          mutation = 'ADD_MULTIPLE_ITEMS';
        } else {
          mutation = 'ADD_ITEMS';
        }
        commit(mutation, {item: payload.name, data: result.data.data});
      }).catch(error => {
        throw new Error(`API ${error}`);
      });
  },
  async updateState ({ commit, rootState }, payload) {
    const target = 'items/' + payload.name + '/' + payload.data.id;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + rootState.auth.user.token 
    }
    await axios.patch(target, payload.data, { headers })
      .then(result => {
        commit('UPDATE_ITEMS', {item: payload.name, data: result.data.data});
      }).catch(error => {
        throw new Error(`API ${error}`);
      });
  },
  async removeState ({ commit, rootState }, payload) {
    const target = 'items/' + payload.name + '/' + payload.id;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + rootState.auth.user.token 
    }
    await axios.delete(target, { headers: headers })
      .then(() => {
        commit('DELETE_ITEMS', {item: payload.name, data: payload.id});
      }).catch(error => {
        throw new Error(`API ${error}`);
      });
  },
  toggleLoading ({ commit }) {
    commit('SET_LOADING');
  }
}