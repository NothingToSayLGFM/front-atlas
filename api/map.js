
const map = (axios) => {
  return {
    getMap (data) {
      return axios.post('/map', data)
    }
  }
}

export default map
