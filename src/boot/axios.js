import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000' 
})

export default async ({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api

  return { api }
}

export { axios, api }