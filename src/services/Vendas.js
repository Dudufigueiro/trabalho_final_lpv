// src/services/Vendas.js
import { api } from 'boot/axios'

export const VendasService = {
  async listar() {
    const { data } = await api.get('/vendas')
    return data
  },

  async buscarPorId(id) {
    const { data } = await api.get(`/vendas/${id}`)
    return data
  },

  async criar(payload) {
    const { data } = await api.post('/vendas', payload)
    return data
  },

  async atualizar(id, payload) {
    const { data } = await api.put(`/vendas/${id}`, payload)
    return data
  },

  async remover(id) {
    await api.delete(`/vendas/${id}`)
  }
}