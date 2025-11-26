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
      :rows="clientesPaginados"
      :columns="colunas"
      row-key="id"
      flat
      bordered
      class="shadow-1"
      :loading="loading"
    >
      <template v-slot:body-cell-acoes="props">
        <q-td class="text-center">
          <q-btn
            flat
            size="sm"
            color="primary"
            label="Editar"
            @click="editarCliente(props.row)"
          />
          <q-btn
            flat
            size="sm"
            color="negative"
            label="Excluir"
            @click="excluirCliente(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:bottom>
        <div class="row items-center justify-between full-width q-pa-sm">
          <div class="text-caption text-bold">
            Mostrando {{ rangeInicio }} até {{ rangeFim }} de {{ clientes.length }} Registros
          </div>

          <div class="row items-center q-gutter-xs">
            <q-btn
              dense
              flat
              icon="chevron_left"
              :disable="pagina === 1"
              @click="pagina--"
            />
            <div class="text-caption">
              Página {{ pagina }} de {{ totalPaginas }}
            </div>
            <q-btn
              dense
              flat
              icon="chevron_right"
              :disable="pagina === totalPaginas"
              @click="pagina++"
            />
          </div>
        </div>
      </template>
    </q-table>

    <q-dialog v-model="modalAberta" persistent>
      <q-card style="width: 450px; max-width: 90vw;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">
            {{ editando ? 'Editar Cliente' : 'Novo Cliente' }}
          </div>
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
              type="date"
              outlined
              dense
              class="q-mb-md"
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancelar" v-close-popup />
              <q-btn
                :label="editando ? 'Atualizar' : 'Salvar'"
                color="primary"
                type="submit"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useClientesStore } from 'src/stores/Clientes'

const clientesStore = useClientesStore()

const clientes = computed(() => clientesStore.clientes)
const loading = computed(() => clientesStore.loading)

const colunas = [
  { name: 'data', label: 'Data de Cadastro', align: 'left', field: 'data' },
  { name: 'codigo', label: 'Código Cliente', align: 'left', field: 'codigo' },
  { name: 'nome', label: 'Nome', align: 'left', field: 'nome' },
  { name: 'email', label: 'Email', align: 'left', field: 'email' },
  { name: 'telefone', label: 'Telefone', align: 'left', field: 'telefone' },
  { name: 'acoes', label: 'Ações', align: 'center' }
]

const modalAberta = ref(false)
const editando = ref(false)

const novoCliente = ref({
  id: null,
  data: '',
  codigo: '',
  nome: '',
  email: '',
  telefone: ''
})

const pagina = ref(1)
const linhasPorPagina = 5

const totalPaginas = computed(() => {
  const total = clientes.value.length
  return total ? Math.ceil(total / linhasPorPagina) : 1
})

const clientesPaginados = computed(() => {
  const inicio = (pagina.value - 1) * linhasPorPagina
  const fim = inicio + linhasPorPagina
  return clientes.value.slice(inicio, fim)
})

const rangeInicio = computed(() =>
  clientes.value.length ? (pagina.value - 1) * linhasPorPagina + 1 : 0
)

const rangeFim = computed(() =>
  Math.min(pagina.value * linhasPorPagina, clientes.value.length)
)

onMounted(() => {
  clientesStore.carregarClientes()
})

const abrirModal = () => {
  editando.value = false
  novoCliente.value = {
    id: null,
    data: '',
    codigo: '',
    nome: '',
    email: '',
    telefone: ''
  }
  modalAberta.value = true
}

const salvarCliente = async () => {
  if (!novoCliente.value.nome || !novoCliente.value.email || !novoCliente.value.codigo) {
    alert('Preencha os campos obrigatórios: Nome, Email e Código.')
    return
  }

  const payload = {
    data: novoCliente.value.data,
    codigo: novoCliente.value.codigo,
    nome: novoCliente.value.nome,
    email: novoCliente.value.email,
    telefone: novoCliente.value.telefone
  }

  try {
    if (editando.value && novoCliente.value.id) {
      await clientesStore.atualizarCliente(novoCliente.value.id, payload)
    } else {
      await clientesStore.adicionarCliente(payload)
      pagina.value = totalPaginas.value
    }

    modalAberta.value = false
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
    alert('Erro ao salvar cliente.')
  }
}

const editarCliente = (cliente) => {
  editando.value = true
  novoCliente.value = { ...cliente }
  modalAberta.value = true
}

const excluirCliente = async (cliente) => {
  const confirmar = confirm(
    `Tem certeza que deseja excluir o cliente "${cliente.nome}" (código ${cliente.codigo})?`
  )
  if (!confirmar) return

  try {
    await clientesStore.removerCliente(cliente.id)

    if (clientesPaginados.value.length === 0 && pagina.value > 1) {
      pagina.value--
    }
  } catch (error) {
    console.error('Erro ao excluir cliente:', error)
    alert('Erro ao excluir cliente.')
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