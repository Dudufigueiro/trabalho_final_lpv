<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 q-mb-lg">
      <b>Listagem de Clientes</b>
    </div>

    <div class="row justify-end q-mb-md">
      <q-btn
        label="Adicionar Cliente"
        color="primary"
        unelevated
        rounded
        @click="abrirModal"
      />
    </div>

    <q-table
      :rows="clientes"
      :columns="colunas"
      row-key="codigo"
      flat
      bordered
      class="shadow-1"
    >
      <template v-slot:body-cell-acoes="props">
        <q-td class="text-center">
          <q-btn flat size="sm" color="primary" label="Editar" @click="editarCliente(props.row)" />
          <q-btn flat size="sm" color="negative" label="Excluir" @click="excluirCliente(props.row)" />
        </q-td>
      </template>

      <template v-slot:bottom>
        <div class="text-caption text-bold q-pa-sm">
          Mostrando 1 até {{ clientes.length }} de {{ clientes.length }} Registros
        </div>
      </template>
    </q-table>

    <q-dialog v-model="modalAberta" persistent>
      <q-card style="width: 450px; max-width: 90vw;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Novo Cliente</div>
          <q-btn flat dense round icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="salvarCliente">
            <q-input
              v-model="novoCliente.nome"
              label="Nome"
              outlined
              dense
              class="q-mb-sm"
              required
            />
            <q-input
              v-model="novoCliente.email"
              label="Email"
              outlined
              dense
              class="q-mb-sm"
              required
            />
            <q-input
              v-model="novoCliente.telefone"
              label="Telefone"
              mask="(##) ####-####"
              outlined
              dense
              class="q-mb-sm"
            />
            <q-input
              v-model="novoCliente.codigo"
              label="Código do Cliente"
              outlined
              dense
              class="q-mb-sm"
              required
            />
            <q-input
              v-model="novoCliente.data"
              label="Data de Cadastro"
              outlined
              dense
              type="date"
              class="q-mb-md"
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancelar" v-close-popup />
              <q-btn label="Salvar" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const clientes = ref([
  { data: '2023-01-15', codigo: 'CLI001', nome: 'Carlos Silva', email: 'carlos.silva@email.com', telefone: '(11) 9999-8888' },
  { data: '2023-02-20', codigo: 'CLI002', nome: 'Ana Souza', email: 'ana.souza@email.com', telefone: '(21) 8888-7777' },
  { data: '2023-03-10', codigo: 'CLI003', nome: 'Ricardo Almeida', email: 'ricardo.almeida@email.com', telefone: '(31) 7777-6666' },
  { data: '2023-04-05', codigo: 'CLI004', nome: 'Fernanda Costa', email: 'fernanda.costa@email.com', telefone: '(41) 6666-5555' },
  { data: '2023-05-12', codigo: 'CLI005', nome: 'Lucas Pereira', email: 'lucas.pereira@email.com', telefone: '(51) 5555-4444' },
])

const colunas = [
  { name: 'data', label: 'Data de Cadastro', align: 'left', field: 'data' },
  { name: 'codigo', label: 'Código Cliente', align: 'left', field: 'codigo' },
  { name: 'nome', label: 'Nome', align: 'left', field: 'nome' },
  { name: 'email', label: 'Email', align: 'left', field: 'email' },
  { name: 'telefone', label: 'Telefone', align: 'left', field: 'telefone' },
  { name: 'acoes', label: 'Ações', align: 'center' },
]

const modalAberta = ref(false)

const novoCliente = ref({
  data: '',
  codigo: '',
  nome: '',
  email: '',
  telefone: ''
})

const abrirModal = () => {
  novoCliente.value = { data: '', codigo: '', nome: '', email: '', telefone: '' }
  modalAberta.value = true
}

const salvarCliente = () => {
  if (!novoCliente.value.nome || !novoCliente.value.email || !novoCliente.value.codigo) {
    alert('Preencha todos os campos obrigatórios!')
    return
  }

  clientes.value.push({ ...novoCliente.value })
  modalAberta.value = false
}

const editarCliente = (cliente) => {
  alert(`Editar cliente: ${cliente.nome}`)
}

const excluirCliente = (cliente) => {
  const confirmar = confirm(`Tem certeza que deseja excluir o cliente ${cliente.nome}?`)
  if (confirmar) {
    clientes.value = clientes.value.filter(c => c.codigo !== cliente.codigo)
  }
}
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
  border-radius: 10px;
}

.q-btn {
  font-weight: 500;
}
</style>