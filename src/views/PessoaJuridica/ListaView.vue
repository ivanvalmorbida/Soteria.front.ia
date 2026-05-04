<template>
  <LayoutApp>
    <div class="animate-fade-in">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-dark-100 mb-2">Pessoas Jurídicas</h1>
          <p class="text-dark-300">Gerencie os cadastros de empresas</p>
        </div>
        <router-link to="/pessoas-juridicas/novo" class="btn-primary">
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nova Empresa
        </router-link>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="pessoas.length > 0" class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th class="table-header">Código</th>
                <th class="table-header">Razão Social</th>
                <th class="table-header">Nome Fantasia</th>
                <th class="table-header">CNPJ</th>
                <th class="table-header">Cidade</th>
                <th class="table-header text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pessoa in pessoas" :key="pessoa.codigo" class="hover:bg-dark-800 transition-colors">
                <td class="table-cell">
                  <span class="font-mono text-sm font-semibold text-secondary-600">#{{ pessoa.codigo }}</span>
                </td>
                <td class="table-cell">
                  <div class="font-medium text-dark-100">{{ pessoa.razaoSocial }}</div>
                </td>
                <td class="table-cell">{{ pessoa.nome }}</td>
                <td class="table-cell">
                  <span class="font-mono text-sm">{{ formatCnpj(pessoa.cnpj) }}</span>
                </td>
                <td class="table-cell">{{ pessoa.cidadeNome || '-' }}</td>
                <td class="table-cell text-right">
                  <div class="flex justify-end gap-2">
                    <router-link :to="`/pessoas-juridicas/${pessoa.codigo}`" class="p-2 rounded-lg hover:bg-secondary-50 text-secondary-600 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </router-link>
                    <router-link :to="`/pessoas-juridicas/${pessoa.codigo}/editar`" class="p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors" title="Editar">
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

      <div v-else class="card p-16 text-center">
        <svg class="w-24 h-24 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="text-xl font-semibold text-dark-100 mb-2">Nenhuma empresa encontrada</h3>
        <p class="text-dark-300 mb-6">Comece cadastrando uma nova empresa</p>
        <router-link to="/pessoas-juridicas/novo" class="btn-primary inline-flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nova Empresa
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
            Tem certeza que deseja excluir <strong>{{ personToDelete?.razaoSocial }}</strong>?
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
import pessoaJuridicaService from '@/services/pessoaJuridicaService'

const toast = useToast()
const pessoas = ref([])
const loading = ref(false)
const showDeleteModal = ref(false)
const personToDelete = ref(null)
const deleting = ref(false)

const loadPessoas = async () => {
  try {
    loading.value = true
    pessoas.value = await pessoaJuridicaService.getAll()
  } catch (error) {
    toast.error('Erro ao carregar empresas')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (pessoa) => {
  personToDelete.value = pessoa
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    deleting.value = true
    await pessoaJuridicaService.delete(personToDelete.value.codigo)
    toast.success('Empresa excluída com sucesso')
    showDeleteModal.value = false
    loadPessoas()
  } catch (error) {
    toast.error('Erro ao excluir empresa')
    console.error(error)
  } finally {
    deleting.value = false
  }
}

const formatCnpj = (cnpj) => {
  if (!cnpj) return '-'
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

onMounted(() => {
  loadPessoas()
})
</script>
