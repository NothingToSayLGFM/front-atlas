
const filters = (axios) => {
  return {
    getFilters (data) {
        return axios.post('/filters', data)
    }
  }
}

export default filters
