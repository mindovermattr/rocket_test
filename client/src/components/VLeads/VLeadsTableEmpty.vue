<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    message?: string
  }>(),
  {
    icon: 'pi pi-search',
    message: 'Данных нет',
  },
)
</script>

<template>
  <div class="empty-state">
    <i :class="icon" style="font-size: 2rem" />
    <p class="empty-state__text">{{ message }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 12px;
  color: var(--p-text-muted-color);
}

.empty-state__text {
  margin: 0;
  font-size: 14px;
}
</style>
