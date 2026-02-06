<template>
  <LayoutApp>
    <div class="animate-fade-in">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
          <span class="text-gradient">Sistema de Cadastro</span>
        </h1>
        <p class="text-xl text-dark-300 max-w-2xl mx-auto animate-slide-up" style="animation-delay: 0.1s;">
          Gerencie cadastros de pessoas físicas e jurídicas de forma simples e eficiente
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        <router-link
          to="/pessoas-fisicas"
          class="card p-8 hover:scale-105 transition-transform group animate-slide-up"
          style="animation-delay: 0.2s;"
        >
          <div class="flex items-start space-x-4">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-dark-100 mb-2">Pessoas Físicas</h3>
              <p class="text-dark-300 mb-4">Gerencie cadastros de pessoas físicas</p>
              <div class="flex items-center text-primary-600 font-medium">
                Acessar
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </router-link>

        <router-link
          to="/pessoas-juridicas"
          class="card p-8 hover:scale-105 transition-transform group animate-slide-up"
          style="animation-delay: 0.3s;"
        >
          <div class="flex items-start space-x-4">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-dark-100 mb-2">Pessoas Jurídicas</h3>
              <p class="text-dark-300 mb-4">Gerencie cadastros de empresas</p>
              <div class="flex items-center text-secondary-600 font-medium">
                Acessar
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up" style="animation-delay: 0.4s;">
        <div class="text-center p-6">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-dark-100 mb-2">Validação Completa</h3>
          <p class="text-dark-300 text-sm">Validação de CPF, CNPJ e outros dados importantes</p>
        </div>

        <div class="text-center p-6">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-dark-100 mb-2">Rápido e Eficiente</h3>
          <p class="text-dark-300 text-sm">Interface otimizada para cadastros ágeis</p>
        </div>

        <div class="text-center p-6">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-dark-100 mb-2">Seguro</h3>
          <p class="text-dark-300 text-sm">Seus dados protegidos com tecnologia moderna</p>
        </div>
      </div>
    </div>
  </LayoutApp>
</template>

<script setup>
import LayoutApp from '@/components/LayoutApp.vue'
</script>
