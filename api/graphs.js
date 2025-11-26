const graphs = (axios) => {
  return {
    searchGraphOrganisation (obj) {
      return axios.post('/search ', obj)
    },
    getGraph (data) {
      return axios.post('/graph', data)
    }
  }
}

export default graphs
