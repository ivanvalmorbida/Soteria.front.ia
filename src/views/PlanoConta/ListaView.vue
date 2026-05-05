<template>
  <LayoutApp>
    <div class="animate-fade-in">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-dark-100 mb-2">Plano de Contas</h1>
          <p class="text-dark-300">Gerencie o plano de contas contábil</p>
        </div>
        <router-link to="/plano-contas/novo" class="btn-primary">
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nova Conta
        </router-link>
      </div>

      <div class="card p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por descrição..."
              class="input-field"
              @keyup.enter="handleSearch"
            />
          </div>
          <select v-model="filtroTipo" class="input-field md:w-48" @change="loadByTipo">
            <option value="">Todos os tipos</option>
            <option value="A">A - Ativo</option>
            <option value="P">P - Passivo</option>
            <option value="R">R - Receita</option>
            <option value="D">D - Despesa</option>
            <option value="C">C - Custo</option>
          </select>
          <button @click="handleSearch" class="btn-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button v-if="searchTerm || filtroTipo" @click="clearFilters" class="btn-secondary">Limpar</button>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="itens.length > 0" class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th class="table-header">Código</th>
                <th class="table-header">Pai</th>
                <th class="table-header">Tipo</th>
                <th class="table-header">Rótulo</th>
                <th class="table-header">Descrição</th>
                <th class="table-header text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in itens" :key="item.codigo" class="hover:bg-dark-800 transition-colors">
                <td class="table-cell">
                  <span class="font-mono text-sm font-semibold text-primary-600">#{{ item.codigo }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-dark-300 text-sm">{{ item.codigoPaiRotulo || '-' }}</span>
                </td>
                <td class="table-cell">
                  <span class="badge-primary font-mono">{{ item.tipo }}</span>
                </td>
                <td class="table-cell">
                  <span class="font-mono text-sm">{{ item.rotulo }}</span>
                </td>
                <td class="table-cell">
                  <div class="font-medium text-dark-100">{{ item.descricao }}</div>
                </td>
                <td class="table-cell text-right">
                  <div class="flex justify-end gap-2">
                    <router-link
                      :to="`/plano-contas/${item.codigo}/editar`"
                      class="p-2 rounded-lg hover:bg-secondary-50 text-secondary-600 transition-colors"
                      title="Editar"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </router-link>
                    <button
                      @click="confirmDelete(item)"
                      class="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                      title="Excluir"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="card p-16 text-center">
        <h3 class="text-xl font-semibold text-dark-100 mb-2">Nenhuma conta encontrada</h3>
        <p class="text-dark-300 mb-6">Comece cadastrando uma nova conta contábil</p>
        <router-link to="/plano-contas/novo" class="btn-primary inline-flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nova Conta
        </router-link>
      </div>
    </div>

    <teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showDeleteModal = false"
      >
        <div class="card p-6 max-w-md w-full animate-slide-up">
          <h3 class="text-xl font-bold text-dark-100 mb-4">Confirmar exclusão</h3>
          <p class="text-dark-300 mb-6">
            Tem certeza que deseja excluir <strong>{{ itemToDelete?.descricao }}</strong>?
            Esta ação não pode ser desfeita.
          </p>
          <div class="flex gap-3 justify-end">
            <button @click="showDeleteModal = false" class="btn-secondary">Cancelar</button>
            <button @click="handleDelete" class="btn-danger" :disabled="deleting">
              <span v-if="!deleting">Excluir</span>
              <span v-else class="flex items-center">
                <div class="loader mr-2"></div>
                Excluindo...
              </span>
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </LayoutApp>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import LayoutApp from '@/components/LayoutApp.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import planoContaService from '@/services/planoContaService'

const toast = useToast()
const itens = ref([])
const loading = ref(false)
const searchTerm = ref('')
const filtroTipo = ref('')
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const deleting = ref(false)

const loadItens = async () => {
  try {
    loading.value = true
    itens.value = await planoContaService.getAll()
  } catch (error) {
    toast.error('Erro ao carregar plano de contas')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const loadByTipo = async () => {
  if (!filtroTipo.value) {
    loadItens()
    return
  }
  try {
    loading.value = true
    itens.value = await planoContaService.getByTipo(filtroTipo.value)
  } catch (error) {
    toast.error('Erro ao filtrar por tipo')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  if (!searchTerm.value.trim()) {
    if (filtroTipo.value) loadByTipo()
    else loadItens()
    return
  }
  try {
    loading.value = true
    itens.value = await planoContaService.buscarPorDescricao(searchTerm.value)
  } catch (error) {
    toast.error('Erro ao buscar')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchTerm.value = ''
  filtroTipo.value = ''
  loadItens()
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    deleting.value = true
    await planoContaService.delete(itemToDelete.value.codigo)
    toast.success('Conta excluída com sucesso')
    showDeleteModal.value = false
    loadItens()
  } catch (error) {
    toast.error('Erro ao excluir')
    console.error(error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadItens()
})
</script>
