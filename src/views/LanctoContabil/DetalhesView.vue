<template>
  <LayoutApp>
    <div class="max-w-4xl mx-auto animate-fade-in">
      <div class="mb-8">
        <router-link to="/lancamentos-contabeis" class="text-primary-600 hover:text-primary-700 flex items-center mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </router-link>
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-dark-100 mb-2">Lançamento #{{ item?.codigo }}</h1>
            <p class="text-dark-300">{{ formatDate(item?.data) }}</p>
          </div>
          <router-link :to="`/lancamentos-contabeis/${item?.codigo}/editar`" class="btn-primary">
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </router-link>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="item" class="space-y-6">
        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Resumo</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-sm font-medium text-dark-300">Data</label>
              <p class="text-lg">{{ formatDate(item.data) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-dark-300">Valor</label>
              <p class="text-2xl font-mono font-semibold text-primary-400">{{ formatCurrency(item.valor) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-dark-300">Pessoa</label>
              <p class="text-lg">{{ item.pessoaNome || '-' }} <span class="text-sm text-dark-400">(#{{ item.pessoa }})</span></p>
            </div>
            <div>
              <label class="text-sm font-medium text-dark-300">Centro de Custo</label>
              <p class="text-lg">{{ item.centroCustoDescricao || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Partida Dobrada</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border border-red-500/30 rounded-lg p-4 bg-red-500/5">
              <label class="text-sm font-medium text-red-400 mb-2 block">Débito</label>
              <p class="text-lg font-semibold text-dark-100">{{ item.debitoDescricao || '-' }}</p>
              <p class="text-sm text-dark-400 mt-1">Conta #{{ item.debito }}</p>
            </div>
            <div class="border border-green-500/30 rounded-lg p-4 bg-green-500/5">
              <label class="text-sm font-medium text-green-400 mb-2 block">Crédito</label>
              <p class="text-lg font-semibold text-dark-100">{{ item.creditoDescricao || '-' }}</p>
              <p class="text-sm text-dark-400 mt-1">Conta #{{ item.credito }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-4">Histórico</h2>
          <p class="text-dark-200">Histórico padrão: <span class="font-mono">#{{ item.hc }}</span></p>
          <p v-if="item.descricao" class="mt-4 text-dark-200 whitespace-pre-wrap">{{ item.descricao }}</p>
        </div>
      </div>
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import LayoutApp from '@/components/LayoutApp.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import lanctoContabilService from '@/services/lanctoContabilService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const item = ref(null)
const loading = ref(false)

const loadItem = async () => {
  try {
    loading.value = true
    item.value = await lanctoContabilService.getById(route.params.id)
  } catch (error) {
    toast.error('Erro ao carregar lançamento')
    router.push('/lancamentos-contabeis')
  } finally {
    loading.value = false
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
  loadItem()
})
</script>
