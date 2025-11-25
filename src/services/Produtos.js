import { api } from 'boot/axios'

export const ProdutosService = {
  async listar() {
    const { data } = await api.get('/produtos')
    return data
  },

  async buscarPorId(id) {
    const { data } = await api.get(`/produtos/${id}`)
    return data
  },

  async criar(payload) {
    const { data } = await api.post('/produtos', payload)
    return data
  },

  async atualizar(id, payload) {
    const { data } = await api.put(`/produtos/${id}`, payload)
    return data
  },

  async remover(id) {
    await api.delete(`/produtos/${id}`)
  }
}