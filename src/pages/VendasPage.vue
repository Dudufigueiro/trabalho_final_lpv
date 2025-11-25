<template>
  <q-page class="q-pa-lg">

    <div class="text-h5 q-mb-lg"><b>Listagem de Vendas</b></div>

    <div class="row justify-end q-mb-md">
      <q-btn label="Nova Venda" color="primary" unelevated rounded @click="novaVenda" />
    </div>

    <q-table
      :rows="vendas"
      :columns="colunas"
      row-key="id"
      flat bordered
      class="shadow-1"
      :loading="carregando"
      loading-label="Carregando vendas..."
    >

      <template #body-cell-acoes="props">
        <q-td class="text-center">
          <q-btn flat size="sm" color="primary" label="Editar" @click="editarVenda(props.row)" />
          <q-btn flat size="sm" color="negative" label="Excluir" @click="excluirVenda(props.row)" />
          <q-btn flat size="sm" color="dark" label="Detalhes" @click="detalhesVenda(props.row)" />
        </q-td>
      </template>

      <template #body-cell-cliente="props">
        <q-td>
          <a href="#" class="texto-link">{{ props.row.cliente }}</a>
        </q-td>
      </template>

      <template #body-cell-vendedor="props">
        <q-td>
          <a href="#" class="texto-link">{{ props.row.vendedor }}</a>
        </q-td>
      </template>

      <template #bottom>
        <div class="text-caption text-bold q-pa-sm">
          Mostrando 1 até {{ vendas.length }} de {{ vendas.length }} Registros
        </div>
      </template>

    </q-table>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'

const vendas = ref([])
const carregando = ref(false)

const colunas = [
  { name: 'id', label: 'ID da Venda', align: 'left', field: 'id' },
  { name: 'data', label: 'Data da Venda', align: 'center', field: 'data' },
  { name: 'cliente', label: 'Nome do Cliente', align: 'center', field: 'cliente' },
  { name: 'valor', label: 'Valor Total', align: 'center', field: 'valor',
    format: val => `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  },
  { name: 'vendedor', label: 'Vendedor', align: 'center', field: 'vendedor' },
  { name: 'acoes', label: 'Ações', align: 'center' }
]

const carregarVendas = async () => {
  carregando.value = true

  vendas.value = [
    { id: '#12345', data: '15/07/2024', cliente: 'Carlos Silva', valor: 250, vendedor: 'Ana Souza' },
    { id: '#12346', data: '16/07/2024', cliente: 'Mariana Oliveira', valor: 180, vendedor: 'Pedro Santos' },
    { id: '#12347', data: '17/07/2024', cliente: 'Ricardo Almeida', valor: 320, vendedor: 'Ana Souza' },
    { id: '#12348', data: '18/07/2024', cliente: 'Fernanda Costa', valor: 450, vendedor: 'Pedro Santos' },
    { id: '#12349', data: '19/07/2024', cliente: 'Lucas Pereira', valor: 200, vendedor: 'Ana Souza' },
  ]

  carregando.value = false
}

const novaVenda = () => {
  Notify.create({ type: 'info', message: 'Abrir formulário de nova venda...' })
}

const editarVenda = (venda) => {
  Notify.create({ type: 'primary', message: `Editar venda ${venda.id}...` })
}

const excluirVenda = (venda) => {
  if (!confirm(`Deseja excluir a venda ${venda.id}?`)) return
  vendas.value = vendas.value.filter(v => v.id !== venda.id)
  Notify.create({ type: 'positive', message: 'Venda excluída!' })
}

const detalhesVenda = (venda) => {
  Notify.create({ type: 'accent', message: `Abrir detalhes da venda ${venda.id}...` })
}

onMounted(carregarVendas)
</script>

<style scoped>
.q-page {
  background-color: #ffffff;
}

.text-h5 {
  font-size: 22px;
  font-weight: 600;
}

.q-table {
  border-radius: 12px;
}

.texto-link {
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
}
</style>