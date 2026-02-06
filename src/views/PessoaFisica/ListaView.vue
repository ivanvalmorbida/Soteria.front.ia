<template>
  <LayoutApp>
    <div class="animate-fade-in">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-dark-100 mb-2">Pessoas Físicas</h1>
          <p class="text-dark-300">Gerencie os cadastros de pessoas físicas</p>
        </div>
        <router-link to="/pessoas-fisicas/novo" class="btn-primary">
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nova Pessoa
        </router-link>
      </div>

      <!-- Search Bar -->
      <div class="card p-6 mb-8">
        <div class="flex gap-4">
          <div class="flex-1">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por nome, CPF..."
              class="input-field"
              @keyup.enter="handleSearch"
            />
          </div>
          <button @click="handleSearch" class="btn-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button v-if="searchTerm" @click="clearSearch" class="btn-secondary">
            Limpar
          </button>
        </div>
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" />

      <!-- Table -->
      <div v-else-if="pessoas.length > 0" class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th class="table-header">Código</th>
                <th class="table-header">Nome</th>
                <th class="table-header">CPF</th>
                <th class="table-header">Cidade</th>
                <th class="table-header">Telefone</th>
                <th class="table-header text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="pessoa in pessoas"
                :key="pessoa.codigo"
                class="hover:bg-dark-800 transition-colors"
              >
                <td class="table-cell">
                  <span class="font-mono text-sm font-semibold text-primary-600">
                    #{{ pessoa.codigo }}
                  </span>
                </td>
                <td class="table-cell">
                  <div class="font-medium text-dark-100">{{ pessoa.nome }}</div>
                </td>
                <td class="table-cell">
                  <span class="font-mono text-sm">{{ formatCpf(pessoa.cpf) }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-dark-300">{{ pessoa.cidadeNome || '-' }}</span>
                </td>
                <td class="table-cell">
                  <span class="font-mono text-sm">
                    {{ pessoa.telefones && pessoa.telefones[0]?.telefone || '-' }}
                  </span>
                </td>
                <td class="table-cell text-right">
                  <div class="flex justify-end gap-2">
                    <router-link
                      :to="`/pessoas-fisicas/${pessoa.codigo}`"
                      class="p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
                      title="Ver detalhes"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </router-link>
                    <router-link
                      :to="`/pessoas-fisicas/${pessoa.codigo}/editar`"
                      class="p-2 rounded-lg hover:bg-secondary-50 text-secondary-600 transition-colors"
                      title="Editar"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </router-link>
                    <button
                      @click="confirmDelete(pessoa)"
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

      <!-- Empty State -->
      <div v-else class="card p-16 text-center">
        <svg class="w-24 h-24 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-dark-100 mb-2">Nenhuma pessoa encontrada</h3>
        <p class="text-dark-300 mb-6">Comece cadastrando uma nova pessoa física</p>
        <router-link to="/pessoas-fisicas/novo" class="btn-primary inline-flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nova Pessoa Física
        </router-link>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showDeleteModal = false"
      >
        <div class="card p-6 max-w-md w-full animate-slide-up">
          <h3 class="text-xl font-bold text-dark-100 mb-4">Confirmar exclusão</h3>
          <p class="text-dark-300 mb-6">
            Tem certeza que deseja excluir <strong>{{ personToDelete?.nome }}</strong>?
            Esta ação não pode ser desfeita.
          </p>
          <div class="flex gap-3 justify-end">
            <button @click="showDeleteModal = false" class="btn-secondary">
              Cancelar
            </button>
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
import pessoaFisicaService from '@/services/pessoaFisicaService'

const toast = useToast()
const pessoas = ref([])
const loading = ref(false)
const searchTerm = ref('')
const showDeleteModal = ref(false)
const personToDelete = ref(null)
const deleting = ref(false)

const loadPessoas = async () => {
  try {
    loading.value = true
    pessoas.value = await pessoaFisicaService.getAll()
  } catch (error) {
    toast.error('Erro ao carregar pessoas físicas')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  if (!searchTerm.value.trim()) {
    loadPessoas()
    return
  }
  
  try {
    loading.value = true
    pessoas.value = await pessoaFisicaService.search(searchTerm.value)
  } catch (error) {
    toast.error('Erro ao buscar pessoas')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  loadPessoas()
}

const confirmDelete = (pessoa) => {
  personToDelete.value = pessoa
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    deleting.value = true
    await pessoaFisicaService.delete(personToDelete.value.codigo)
    toast.success('Pessoa excluída com sucesso')
    showDeleteModal.value = false
    loadPessoas()
  } catch (error) {
    toast.error('Erro ao excluir pessoa')
    console.error(error)
  } finally {
    deleting.value = false
  }
}

const formatCpf = (cpf) => {
  if (!cpf) return '-'
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

onMounted(() => {
  loadPessoas()
})
</script>
