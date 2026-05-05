<template>
  <LayoutApp>
    <div class="animate-fade-in">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-dark-100 mb-2">Lançamentos Contábeis</h1>
          <p class="text-dark-300">Gerencie os lançamentos contábeis</p>
        </div>
        <router-link to="/lancamentos-contabeis/novo" class="btn-primary">
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Novo Lançamento
        </router-link>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="itens.length > 0" class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th class="table-header">Código</th>
                <th class="table-header">Data</th>
                <th class="table-header">Pessoa</th>
                <th class="table-header">Débito</th>
                <th class="table-header">Crédito</th>
                <th class="table-header">Centro Custo</th>
                <th class="table-header text-right">Valor</th>
                <th class="table-header text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in itens" :key="item.codigo" class="hover:bg-dark-800 transition-colors">
                <td class="table-cell">
                  <span class="font-mono text-sm font-semibold text-primary-600">#{{ item.codigo }}</span>
                </td>
                <td class="table-cell">
                  <span class="font-mono text-sm">{{ formatDate(item.data) }}</span>
                </td>
                <td class="table-cell">
                  <div class="text-dark-100">{{ item.pessoaNome || '-' }}</div>
                </td>
                <td class="table-cell">
                  <span class="text-red-400 text-sm">{{ item.debitoDescricao || '-' }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-green-400 text-sm">{{ item.creditoDescricao || '-' }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-dark-300 text-sm">{{ item.centroCustoDescricao || '-' }}</span>
                </td>
                <td class="table-cell text-right">
                  <span class="font-mono font-semibold text-dark-100">{{ formatCurrency(item.valor) }}</span>
                </td>
                <td class="table-cell text-right">
                  <div class="flex justify-end gap-2">
                    <router-link
                      :to="`/lancamentos-contabeis/${item.codigo}`"
                      class="p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
                      title="Ver detalhes"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </router-link>
                    <router-link
                      :to="`/lancamentos-contabeis/${item.codigo}/editar`"
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
        <h3 class="text-xl font-semibold text-dark-100 mb-2">Nenhum lançamento encontrado</h3>
        <p class="text-dark-300 mb-6">Comece registrando um novo lançamento contábil</p>
        <router-link to="/lancamentos-contabeis/novo" class="btn-primary inline-flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Novo Lançamento
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
            Tem certeza que deseja excluir o lançamento <strong>#{{ itemToDelete?.codigo }}</strong>?
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
import lanctoContabilService from '@/services/lanctoContabilService'

const toast = useToast()
const itens = ref([])
const loading = ref(false)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const deleting = ref(false)

const loadItens = async () => {
  try {
    loading.value = true
    itens.value = await lanctoContabilService.getAll()
  } catch (error) {
    toast.error('Erro ao carregar lançamentos')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    deleting.value = true
    await lanctoContabilService.delete(itemToDelete.value.codigo)
    toast.success('Lançamento excluído com sucesso')
    showDeleteModal.value = false
    loadItens()
  } catch (error) {
    toast.error('Erro ao excluir')
    console.error(error)
  } finally {
    deleting.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  const [y, m, d] = date.split('T')[0].split('-')
  return `${d}/${m}/${y}`
}

const formatCurrency = (value) => {
  if (value == null) return '-'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

onMounted(() => {
  loadItens()
})
</script>
