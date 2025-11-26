import _ from 'lodash'
import Vue from 'vue'
import Cookies from 'js-cookie'
import countries from '~/mocks/countries.js'

Object.defineProperty(Vue.prototype, '$_', { value: _ })

export const state = () => ({
  cooks: true,
  filters: {},
  filter_options: {
    year: 2020,
    country_field: 'inc_country',
    focus: [],
    op_status: [],
    segment: [],
    country: [],
    org_type: [],
    own_type: []
  },
  zoom: false,
  selectedItemPrevious: null,
  selectedItem: [],
  selectedItemMap: [],
  taxonomy: [],
  organisations: [],
  categories: [],
  countries: [],
  map: [],
  scale: {
    graph: 1,
    map: 1
  },
  updateGraph: false,
  createGraph: false,
  updateMap: false,
  createMap: false,
  sortOptions: [
    {
      name: 'Market segments',
      value: true
    },
    {
      name: 'Incorporation year',
      value: false
    },
    {
      name: 'Entry year',
      value: true
    },
    {
      name: 'Type',
      value: false
    },
    {
      name: 'Op. HQ',
      value: true
    },
    {
      name: 'Inc. Country',
      value: true
    },
    {
      name: 'Total disclosed funding',
      value: false
    },
    {
      name: 'Number of employees',
      value: false
    },
    {
      name: 'Valuation',
      value: false
    },
    {
      name: 'Social',
      value: false
    },
    {
      name: 'Cessation date',
      value: false
    },
    {
      name: 'Cessation of op. reason',
      value: false
    }
  ]
})

export const getters = {
  selectedItemLast: (state) => {
    return state.selectedItem[state.selectedItem.length - 1]
  },
  selectedItemMapLast: (state) => {
    return state.selectedItemMap[state.selectedItemMap.length - 1]
  },
  getOrganisations: (state) => {
    return JSON.parse(JSON.stringify(state.organisations)).map((el) => {
      el.class = 'organisation'
      el.name = el.name[el.name.length - 1].value
      return el
    })
  }
}

export const mutations = {
  UPDATE_GRAPH (state) {
    state.updateGraph = !state.updateGraph
  },
  CREATE_GRAPH (state) {
    state.createGraph = !state.createGraph
  },
  UPDATE_MAP (state) {
    state.updateMap = !state.updateMap
  },
  CREATE_MAP (state) {
    state.createMap = !state.createMap
  },
  SET_FILTERS_FOCUS (state, payload) {
    state.filter_options.focus = payload
  },
  SET_FILTERS_STATUS (state, payload) {
    state.filter_options.op_status = payload
  },
  SET_FILTERS_SEGMENT (state, payload) {
    state.filter_options.segment = payload
  },
  SET_FILTERS_COUNTRY (state, payload) {
    state.filter_options.country = payload
  },
  SET_FILTERS_COUNTRY_FIELD (state, payload) {
    state.filter_options.country_field = payload
  },
  SET_FILTERS_ORG_TYPE (state, payload) {
    state.filter_options.org_type = payload
  },
  SET_FILTERS_OWN_TYPE (state, payload) {
    state.filter_options.own_type = payload
  },
  SET_FILTERS_YEAR (state, payload) {
    state.filter_options.year = payload
  },
  SET_DEFAULT_FILTERS (state) {
    state.filter_options = {
      year: 2020,
      country_field: 'inc_country',
      focus: [],
      op_status: [],
      segment: [],
      country: [],
      org_type: [],
      own_type: []
    }
  },
  SET_FILTERS (state, [data, meta]) {
    data.total = meta.total || 0
    state.filters = data
  },
  SET_FILTERS_OPTIONS (state, payload) {
    state.filter_options = payload
  },
  SET_MAP_SCALE (state, payload) {
    state.scale.map = payload
  },
  SET_GRAPH_SCALE (state, payload) {
    state.scale.graph = payload
  },
  SET_ZOOM (state, payload) {
    state.zoom = payload
  },
  SET_SORT_OPTIONS (state, payload) {
    state.sortOptions = payload
  },
  CLEAR_SELECTED_ITEM (state) {
    state.selectedItem = []
  },
  CLEAR_SELECTED_ITEM_MAP (state) {
    state.selectedItemMap = []
  },
  SET_SELECTED_ITEM (state, payload) {
    if (!payload) {
      state.selectedItem.pop()
    } else {
      state.selectedItem.push(payload)
    }
  },
  SET_SELECTED_ITEM_MAP (state, payload) {
    if (!payload) {
      state.selectedItemMap.pop()
    } else {
      state.selectedItemMap.push(payload)
    }
  },
  SET_COOK (state, payload) {
    state.cooks = payload
    if (payload) {
      Cookies.set('CookieControl', { analytics: 'true' }, {
        expires: 365
      })
    }
  },
  SET_DATA (state, countries) {
    state.countries = countries
  },
  SET_ORGANISATIONS (state, payload) {
    state.organisations = payload
  },
  SET_TAXONOMY (state, payload) {
    state.taxonomy = payload
  },
  SET_MAP (state, payload) {
    state.map = payload
  }
}

export const actions = {
  async getOrganisation ({ commit, getters, state }, [id, map]) {
    try {
      if (id) {
        const obj = {
          sections: [],
          filters: state.filter_options
        }
        const organisation = await this.$api.organisations.getOrganisations(id, obj)
        await this.$axios.post(`/v1/organisations/${id}`, {
          sections: [],
          filters: state.filter_options
        })
        if (map) {
          await commit('SET_SELECTED_ITEM_MAP', organisation.data.data)
        } else {
          await commit('SET_SELECTED_ITEM', organisation.data.data)
        }
      }
    } catch (e) {
      alert(e)
    }
  },
  async getCountry ({ commit, getters, state }, id) {
    try {
      if (id) {
        const obj = {
          sections: [],
          filters: state.filter_options
        }
        const organisation = await this.$api.categories.getCountryById(id, obj)
        await this.$axios.post(`/v1/countries/${id}`, {
          sections: [],
          filters: state.filter_options
        })
        await commit('SET_SELECTED_ITEM_MAP', organisation.data.data)
      }
    } catch (e) {
      alert(e)
    }
  },
  async getOrganisations ({ commit, getters, state }, id) {
    try {
      const item = getters.selectedItemLast
      if (id) {
        const obj = {
          sections: [],
          filters: state.filter_options
        }
        const organisations = await this.$api.organisations.getOrganisationsByCategoryId(id, obj)
        await this.$axios.post(`/v1/categories/${id}/organisations`, {
          sections: [],
          filters: state.filter_options
        })
        commit('SET_ORGANISATIONS', organisations.data.data)
      } else if (item) {
        if (item.class === 'category') {
          id = item.id
        } else {
          id = item.categories[0].id
        }
        const obj = {
          sections: [],
          filters: state.filter_options
        }
        const organisations = await this.$api.organisations.getOrganisationsByCategoryId(id, obj)
       await this.$axios.post(`/v1/categories/${id}/organisations`, {
          sections: [],
          filters: state.filter_options
        })
        commit('SET_ORGANISATIONS', organisations.data.data)
      }
    } catch (e) {
      alert(e)
    }
  },
  async getFilters ({ commit, state }) {
    try {
      const obj = {
        sections: [],
        filters: state.filter_options
      }
      const filters = await this.$api.filters.getFilters(obj)
      // await this.$axios.post('/v1/filters', {
      //   sections: [],
      //   filters: state.filter_options
      // })
      commit('SET_FILTERS', [filters.data.data, filters.data.meta])
    } catch (e) {
      alert(e)
    }
  },
  async getGraph ({ commit, state }) {
    try {
      const obj = {
        sections: [],
        filters: state.filter_options
      }
      const graph = await this.$api.graphs.getGraph(obj)
      // await this.$axios.post('/v1/graph', {
      //   sections: [],
      //   filters: state.filter_options
      // })
      commit('SET_TAXONOMY', graph.data.data)
    } catch (e) {
      alert(e)
    }
  },
  async getMap ({ commit, state }) {
    try {
      const obj = {
        sections: [],
        filters: state.filter_options
      }
      // const map =  await this.$axios.post('/v1/map', {
      //   sections: [],
      //   filters: state.filter_options
      // })
      const map = await this.$api.map.getMap(obj)

      commit('SET_MAP', map.data.data)
    } catch (e) {
      alert(e)
      alert('set_map')
    }
  },
  setQueryParams ({ commit, state }, query) {
    const filterOptions = {
      year: 2020,
      country_field: 'inc_country',
      focus: [],
      op_status: [],
      segment: [],
      country: [],
      org_type: [],
      own_type: []
    }
    for (const param in query) {
      // eslint-disable-next-line no-prototype-builtins
      if (filterOptions.hasOwnProperty(param)) {
        filterOptions[param] = (param === 'year' || param === 'country_field') ? query[param] : query[param].split(',')
      }
    }
    if (query.organisation) { filterOptions.year = 2020 }
    commit('SET_FILTERS_OPTIONS', filterOptions)
  },
  async getDataForTable ({ commit, state, dispatch }, query) {
    try {
      await dispatch('setQueryParams', query)
      await Promise.all([
        dispatch('getFilters'),
        dispatch('getGraph'),
        commit('SET_DATA', countries.data)
      ])
    } catch (e) {
      alert(e)
    }
  },
  async getMapData ({ commit, state, dispatch }, query) {
    try {
      await dispatch('setQueryParams', query)
      await Promise.all([
        dispatch('getFilters'),
        dispatch('getMap')
      ])
      if (query.organisation) {
        await dispatch('getOrganisation', [query.organisation, true])
      } else if (query.countries) {
        await dispatch('getCountry', query.countries)
      }
    } catch (e) {
      alert(e)
    }
  },
  async getGraphData ({ commit, state, dispatch }, query) {
    try {
      if (!_.isEmpty(query)) { await dispatch('setQueryParams', query) }
      await Promise.all([
        dispatch('getFilters'),
        dispatch('getGraph')
      ])
      if (query.organisation) {
        await dispatch('getOrganisation', [query.organisation, false])
      } else if (query.category) {
        const item = state.taxonomy.find(cat => cat.id === query.category)
        await commit('SET_SELECTED_ITEM', item)
        await dispatch('getOrganisations', query.category)
      }
      await commit('CREATE_GRAPH')
    } catch (e) {
      alert(e)
    }
  },
  async updateFilters ({ commit, state, dispatch }, [commitMessage, commitValue]) {
    await commit(commitMessage, commitValue)
    await Promise.all([
      dispatch('getGraph'),
      dispatch('getMap'),
      dispatch('getFilters'),
      dispatch('getOrganisations'),
      dispatch('pushState')
    ])
    commit('UPDATE_GRAPH')
    commit('UPDATE_MAP')
  },
  async clearSelectedItem ({ commit, state, dispatch }) {
    await commit('CLEAR_SELECTED_ITEM')
    dispatch('pushState')
    commit('CREATE_GRAPH')
  },
  async updateSelectedItem ({ commit, state, dispatch }, payload) {
    if (payload) {
      if (payload.edate) {
        await commit('SET_FILTERS_YEAR', 2020)
        dispatch('getFilters')
      }
      const item = state.taxonomy.find(cat => cat.id === payload.id)
      await commit('SET_SELECTED_ITEM', item || _.cloneDeep(payload))
      await dispatch('getOrganisations')
    } else {
      await commit('SET_SELECTED_ITEM', payload)
      await dispatch('getOrganisations')
    }
    dispatch('pushState')
    commit('CREATE_GRAPH')
  },
  async clearSelectedItemMap ({ commit, state, dispatch }) {
    await commit('CLEAR_SELECTED_ITEM_MAP')
    dispatch('pushState')
    commit('CREATE_MAP')
  },
  async updateSelectedItemMap ({ commit, state, dispatch }, payload) {
    if (payload) {
      if (payload.edate) {
        await commit('SET_FILTERS_YEAR', 2020)
        dispatch('getFilters')
      }
      await commit('SET_SELECTED_ITEM_MAP', _.cloneDeep(payload))
      await dispatch('getOrganisations')
    } else {
      await commit('SET_SELECTED_ITEM_MAP', payload)
      await dispatch('getOrganisations')
    }
    dispatch('pushState')
    commit('CREATE_MAP')
  },
  pushState ({ state, getters }) {
    const selectedItem = getters.selectedItemLast
    const selectedItemMap = getters.selectedItemMapLast
    history.pushState(
      {},
      null,
      this.$router.history.current.path +
      `?country_field=${state.filter_options.country_field}` +
      (_.isEmpty(state.filter_options.country) ? '' : `&country=${state.filter_options.country}`) +
      (_.isEmpty(state.filter_options.focus) ? '' : `&focus=${state.filter_options.focus}`) +
      (_.isEmpty(state.filter_options.op_status) ? '' : `&op_status=${state.filter_options.op_status}`) +
      (_.isEmpty(state.filter_options.org_type) ? '' : `&org_type=${state.filter_options.org_type}`) +
      (_.isEmpty(state.filter_options.own_type) ? '' : `&own_type=${state.filter_options.own_type}`) +
      (_.isEmpty(state.filter_options.segment) ? '' : `&segment=${state.filter_options.segment}`) +
      (!state.filter_options.year ? '' : `&year=${state.filter_options.year}`) +
      (!selectedItem ? '' : selectedItem.class === 'category' ? `&category=${selectedItem.id}` : `&organisation=${selectedItem.id}&category=${selectedItem.categories[0].id}`) +
      (!selectedItemMap ? '' : selectedItemMap.code ? `&countries=${selectedItemMap.id}` : `&organisation=${selectedItemMap.id}`)
    )
  }
}
