<template>
  <LayoutApp>
    <div class="max-w-3xl mx-auto animate-fade-in">
      <div class="mb-8">
        <router-link to="/hospedagens" class="text-primary-600 hover:text-primary-700 flex items-center mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-dark-100">Detalhes da Hospedagem</h1>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="item" class="space-y-6">
        <div class="card p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span class="text-sm text-dark-400">Código</span>
              <p class="font-mono text-lg font-semibold text-primary-600">#{{ item.codigo }}</p>
            </div>

            <div>
              <span class="text-sm text-dark-400">Status</span>
              <p>
                <span
                  class="badge-primary"
                  :class="{
                    'bg-green-100 text-green-800': item.status === 'Ativa',
                    'bg-blue-100 text-blue-800': item.status === 'Finalizada',
                    'bg-red-100 text-red-800': item.status === 'Cancelada',
                    'bg-yellow-100 text-yellow-800': item.status === 'Reserva'
                  }"
                >
                  {{ getStatusLabel(item.status) }}
                </span>
              </p>
            </div>

            <div class="md:col-span-2">
              <span class="text-sm text-dark-400">Hóspede</span>
              <p class="font-medium text-dark-100">{{ item.pessoaNome || '-' }}</p>
              <p class="text-xs text-dark-400">Código: {{ item.pessoa }}</p>
            </div>

            <div>
              <span class="text-sm text-dark-400">Quarto</span>
              <p class="text-dark-100">{{ item.quarto || '-' }}</p>
            </div>

            <div>
              <span class="text-sm text-dark-400">Cadastrado em</span>
              <p class="text-dark-100">{{ formatDate(item.cadastrado) }}</p>
            </div>

            <div>
              <span class="text-sm text-dark-400">Check-in</span>
              <p class="text-dark-100 font-semibold">{{ formatDateTime(item.checkin) }}</p>
            </div>

            <div>
              <span class="text-sm text-dark-400">Check-out</span>
              <p class="text-dark-100">{{ formatDateTime(item.checkout) || '-' }}</p>
            </div>

            <div>
              <span class="text-sm text-dark-400">Valor Diária</span>
              <p class="text-dark-100 font-semibold">{{ formatCurrency(item.diaria) }}</p>
            </div>

            <div>
              <span class="text-sm text-dark-400">Total</span>
              <p class="text-dark-100 font-semibold">{{ formatCurrency(item.total) }}</p>
            </div>

            <div class="md:col-span-2" v-if="item.observacoes">
              <span class="text-sm text-dark-400">Observações</span>
              <p class="text-dark-100 whitespace-pre-wrap">{{ item.observacoes }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <router-link :to="`/hospedagens/${item.codigo}/editar`" class="btn-secondary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </router-link>
          <button @click="confirmDelete(item)" class="btn-danger">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Excluir
          </button>
        </div>
      </div>

      <div v-else class="card p-16 text-center">
        <p class="text-dark-300">Hospedagem não encontrada</p>
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
            Tem certeza que deseja excluir a hospedagem de <strong>{{ itemToDelete?.pessoaNome }}</strong>?
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
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import LayoutApp from '@/components/LayoutApp.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import hospedagemService from '@/services/hospedagemService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const item = ref(null)
const loading = ref(false)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const deleting = ref(false)

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

const formatDateTime = (date) => {
  if (!date) return null
  return new Date(date).toLocaleString('pt-BR')
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return '-'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const getStatusLabel = (status) => status || '-'

const loadItem = async () => {
  try {
    loading.value = true
    item.value = await hospedagemService.getById(route.params.id)
  } catch (error) {
    toast.error('Erro ao carregar dados')
    router.push('/hospedagens')
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
    await hospedagemService.delete(itemToDelete.value.codigo)
    toast.success('Hospedagem excluída com sucesso')
    router.push('/hospedagens')
  } catch (error) {
    toast.error('Erro ao excluir')
    console.error(error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadItem()
})
</script>
