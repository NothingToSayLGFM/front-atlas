
const countries = (axios) => {
  return {
    searchMapCountry (id) {
      return axios.post(`/countries/${id}`, {
        pagination: {
          from: 0,
          size: 10000
        }
      })
    },
    searchMapCountryOrganisations (data) {
        return axios.post('/search ', data)
    },
    getCountryById (id, data) {
        return axios.post(`/countries/${id}`, data)
    }
  }
}

export default countries
