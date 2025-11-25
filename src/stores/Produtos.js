import { defineStore } from 'pinia'
import { ProdutosService } from 'src/services/Produtos'

export const useProdutosStore = defineStore('produtos', {
  state: () => ({
    produtos: [],
    loading: false,
    error: null
  }),

  actions: {
    async carregarProdutos() {
      this.loading = true
      this.error = null
      try {
        const data = await ProdutosService.listar()
        this.produtos = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Erro ao carregar produtos:', err)
        this.error = 'Erro ao carregar produtos.'
        this.produtos = []
      } finally {
        this.loading = false
      }
    },

    async adicionarProduto(payload) {
      this.loading = true
      try {
        const criado = await ProdutosService.criar(payload)
        this.produtos.push(criado)
      } catch (err) {
        console.error('Erro ao criar produto:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async atualizarProduto(id, payload) {
      this.loading = true
      try {
        const atualizado = await ProdutosService.atualizar(id, payload)
        const idx = this.produtos.findIndex(p => p.id === id)
        if (idx !== -1) {
          this.produtos[idx] = atualizado
        }
      } catch (err) {
        console.error('Erro ao atualizar produto:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async removerProduto(id) {
      this.loading = true
      try {
        await ProdutosService.remover(id)
        this.produtos = this.produtos.filter(p => p.id !== id)
      } catch (err) {
        console.error('Erro ao remover produto:', err)
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})