import axios from 'axios'

// state
export const state = {
  departaments: [],
  sections: [],
  teams: [],
  owners: [],
  kpis: [],
  values: [],
  activeDepartamentId: null,
  activeSectionId: null,
  activeTabKey: 0,
  loading: false
}

// getters
export const getters = {
  getItemById: (state) => ({name, id}) => {
    return state[name].find(item => item.id == id)
  },
  getValuesByKpi: (state) => (kpi_id) => {
    return state.values.filter(val => val.kpi_id == kpi_id)
  },
  getValuesByMultipleKpis: (state) => (kpiIds) => {
    return state.values.filter(val => kpiIds.includes(val.kpi_id))
  },
  getKpiByTeam: (state) => (team_id) => {
    return state.kpis.filter(kpi => kpi.team_id == team_id)
  },
  getTeamBySection: (state) => (section_id) => {
    return state.teams.filter(team => team.section_id == section_id)
  },
  getSectionByDepartament: (state) => (departament_id) => {
    return state.sections.filter(section => section.departament_id == departament_id)
  },
}

// mutations
export const mutations = {
  SET_ITEMS (state, {item, data}) {
    state[item] = data
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
  UPDATE_SIMPLE_STATE (state, {item, data}) {
    state[item] = data
  },
  SET_LOADING (state) {
    state.loading = !state.loading
  },
}

// actions
export const actions = {
  async initState({ commit, rootState }) {
    const items = ['departaments', 'sections', 'teams', 'owners', 'kpis', 'values'];
    const actives = [
      {itemName: 'departaments', activeName: 'activeDepartamentId'}, 
      {itemName: 'sections', activeName: 'activeSectionId'}, 
    ];
    items.map(async stateName => {
      let target = 'items/' + stateName + '?filter[status]=published';
      await axios.get(target, 
        { params: 
          { access_token: rootState.auth.user.token } 
        }).then(result => {
          commit('SET_ITEMS', {item: stateName, data: result.data.data});
          for(let i = 0; i < actives.length; i++) {
              if (actives[i].itemName == stateName) {
                commit('SET_ITEMS', {item: actives[i].activeName, data: result.data.data[0].id});
                break;
              }
          }
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
  async addApiState ({ commit, rootState }, payload) {
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
  async updateApiState ({ commit, rootState }, payload) {
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
  async removeApiState ({ commit, rootState }, payload) {
    const target = 'items/' + payload.name + '/' + payload.id;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + rootState.auth.user.token 
    }
    await axios.patch(target, {status: 'Archived'}, { headers })
      .then(() => {
        commit('DELETE_ITEMS', {item: payload.name, data: payload.id});
      }).catch(error => {
        throw new Error(`API ${error}`);
      });
  },
  updateSimpleState ({ commit }, payload) {
    commit('UPDATE_SIMPLE_STATE', {item: payload.name, data: payload.data});
  },
  toggleLoading ({ commit }) {
    commit('SET_LOADING');
  }
}