import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5022/api', // sua API em C#
  timeout: 8000
})

export default boot(({ app }) => {
  // torna acessível via this.$axios e this.$api
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }