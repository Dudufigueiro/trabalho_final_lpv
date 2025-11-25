<template>
  <q-page padding>
    <div class="text-h6 text-weight-medium q-mb-lg">
      Bem-vindo, Eduardo!
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4" v-for="card in cards" :key="card.label">
        <q-card class="q-pa-lg text-center bg-white rounded-borders shadow-1">
          <q-icon :name="card.icon" size="40px" color="positive" />
          <div class="text-caption text-grey-7 q-mt-sm">{{ card.label }}</div>
          <div class="text-h5 text-bold q-mt-xs">{{ card.value }}</div>
        </q-card>
      </div>
    </div>

    <q-card class="q-pa-md bg-white rounded-borders shadow-1">
      <div class="text-h6 q-mb-md text-weight-bold">Produtos Mais Vendidos</div>

      <q-table
        :rows="produtos"
        :columns="colunas"
        row-key="codigo"
        flat
        bordered
        dense
        hide-bottom
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'

const cards = ref([
  { label: 'Total de Clientes', value: '—', icon: 'group' },
  { label: 'Total de Vendas', value: '—', icon: 'shopping_cart' },
  { label: 'Total de Vendas (R$)', value: '—', icon: 'attach_money' },
])

const colunas = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left' },
  { name: 'produto', label: 'Produto', field: 'produto', align: 'left' },
  { name: 'quantidade', label: 'Quantidade', field: 'quantidade', align: 'center' },
  { name: 'categoria', label: 'Categoria', field: 'categoria', align: 'left' },
  { name: 'valorTotal', label: 'Valor Total', field: 'valorTotal', align: 'right' },
]

const produtos = ref([])

const carregarDashboard = async () => {
  try {

    const clientesResp = await api.get('/clientes')
    const clientes = clientesResp.data

    const vendasResp = await api.get('/vendas')
    const vendas = vendasResp.data

    let produtosResp = []
    try {
      produtosResp = (await api.get('/produtos')).data
    } catch {
      produtosResp = []
    }

    cards.value[0].value = clientes.length
    cards.value[1].value = vendas.length

    const totalValor = vendas.reduce((soma, v) => soma + (v.valorTotal || 0), 0)
    cards.value[2].value = 'R$ ' + totalValor.toLocaleString('pt-BR')

    produtos.value = produtosResp

  } catch (erro) {
    console.error("Erro carregando dashboard:", erro)
  }
}

onMounted(() => {
  carregarDashboard()
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}
</style>