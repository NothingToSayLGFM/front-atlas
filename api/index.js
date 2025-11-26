import countries from './countries'
import graphs from './graphs'
import organisations from './organisations'
import filters from './filters'
import map from './map'

const apiFactory = (axios) => {
  return {
    countries: countries(axios),
    graphs: graphs(axios),
    organisations: organisations(axios),
    filters: filters(axios),
    map: map(axios)
  }
}

export default ({ $axios }, inject) => {
  $axios.setBaseURL(process.env.NUXT_ENV_API_BASE_URL)
  const api = apiFactory($axios)
  inject('api', api)
}
