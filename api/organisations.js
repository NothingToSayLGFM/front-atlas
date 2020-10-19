
const organisations = (axios) => {
  return {
    getOrganisations (data) {
        return axios.post('/organisations', data)
    },
    getOrganisationById (id, data) {
        return axios.post(`/organisations/${id}`, data)
    },
    getOrganisationsByCategoryId (id, data) {
        return axios.post(`/categories/${id}/organisations`, data)
    }
  }
}

export default organisations
