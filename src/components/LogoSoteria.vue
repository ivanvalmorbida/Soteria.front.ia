<template>
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="SoteriaSoftware"
    role="img"
  >
    <defs>
      <linearGradient :id="gradId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0ea5e9" />
        <stop offset="100%" stop-color="#d946ef" />
      </linearGradient>
    </defs>
    <path
      d="M12 1.5 L20 4.5 V11.7 C20 16.6 16.5 20.6 12 22.5 C7.5 20.6 4 16.6 4 11.7 V4.5 Z"
      :fill="`url(#${gradId})`"
    />
    <path
      d="M15 8.6 C15 7.5 13.7 6.8 12 6.8 C10.3 6.8 9 7.5 9 8.7 C9 10.1 10.5 10.6 12 11 C13.5 11.4 15 11.9 15 13.3 C15 14.5 13.7 15.2 12 15.2 C10.3 15.2 9 14.5 9 13.4"
      fill="none"
      stroke="white"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup>
const gradId = `soteria-grad-${Math.random().toString(36).slice(2, 9)}`
</script>
