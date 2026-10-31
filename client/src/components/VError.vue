<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'

withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: 'Произошла ошибка',
    message: 'Неизвестная ошибка',
  },
)

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <Message severity="error" :closable="false" :pt="{ root: { style: 'width: 100%' } }">
    <div class="error">
      <div class="error__text">
        <span class="error__title">{{ title }}</span>
        <span class="error__message">{{ message }}</span>
      </div>
      <Button label="Повторить" severity="danger" text size="small" @click="emit('retry')" />
    </div>
  </Message>
</template>

<style scoped>
:deep(.p-message-content-wrapper),
:deep(.p-message-text) {
  width: 100%;
  flex: 1 1 auto;
}

:deep(.p-message) {
  width: 100%;
}
.error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.error__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.error__title {
  font-size: 15px;
  font-weight: 600;
}

.error__message {
  font-size: 13px;
}
</style>
