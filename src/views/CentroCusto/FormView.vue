<template>
  <LayoutApp>
    <div class="max-w-2xl mx-auto animate-fade-in">
      <div class="mb-8">
        <router-link to="/centros-custo" class="text-primary-600 hover:text-primary-700 flex items-center mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-dark-100">
          {{ isEditing ? 'Editar Centro de Custo' : 'Novo Centro de Custo' }}
        </h1>
      </div>

      <LoadingSpinner v-if="loading" />

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div class="card p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-if="isEditing">
              <label class="block text-sm font-medium text-dark-200 mb-2">Código</label>
              <input :value="form.codigo" type="text" class="input-field" disabled />
            </div>
            <div :class="isEditing ? 'md:col-span-2' : 'md:col-span-3'">
              <label class="block text-sm font-medium text-dark-200 mb-2">Descrição *</label>
              <input v-model="form.descricao" type="text" required maxlength="100" class="input-field" />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <router-link to="/centros-custo" class="btn-secondary">Cancelar</router-link>
          <button type="submit" class="btn-primary" :disabled="saving">
            <span v-if="!saving">{{ isEditing ? 'Salvar' : 'Cadastrar' }}</span>
            <span v-else class="flex items-center">
              <div class="loader mr-2"></div>
              Salvando...
            </span>
          </button>
        </div>
      </form>
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import LayoutApp from '@/components/LayoutApp.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import centroCustoService from '@/services/centroCustoService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEditing = computed(() => !!route.params.id)
const loading = ref(false)
const saving = ref(false)

const form = ref({
  codigo: null,
  descricao: ''
})

const loadItem = async () => {
  if (!isEditing.value) return
  try {
    loading.value = true
    const data = await centroCustoService.getById(route.params.id)
    form.value = { ...data }
  } catch (error) {
    toast.error('Erro ao carregar dados')
    router.push('/centros-custo')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    saving.value = true
    if (isEditing.value) {
      await centroCustoService.update(form.value.codigo, { descricao: form.value.descricao })
      toast.success('Centro de custo atualizado com sucesso')
    } else {
      await centroCustoService.create({ descricao: form.value.descricao })
      toast.success('Centro de custo cadastrado com sucesso')
    }
    router.push('/centros-custo')
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Erro ao salvar')
    console.error(error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadItem()
})
</script>
