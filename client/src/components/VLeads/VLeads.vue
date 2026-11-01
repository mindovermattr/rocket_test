<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'
import VError from '../VError.vue'
import VLeadsTable from './VLeadsTable.vue'
import { useLeadsView } from './composables/useLeadsView'

const { view, filters, options, state, actions } = useLeadsView()
</script>

<template>
  <div v-if="state.isLoading.value" class="state">
    <ProgressSpinner style="width: 40px; height: 40px" :strokeWidth="4" />
    <span>Загрузка...</span>
  </div>

  <VError
    v-else-if="state.isError.value"
    title="Не удалось загрузить данные"
    :message="state.errorMessage.value"
    class="error"
    @retry="actions.retry"
  />

  <VError
    v-else-if="state.mappingError.value"
    title="Не удалось обработать данные лидов"
    :message="state.mappingError.value.message"
    class="error"
    @retry="actions.retry"
  />

  <template v-else>
    <div class="stats">
      <div class="stat">
        <span class="stat__label">Количество лидов</span>
        <span class="stat__value">{{ view.filteredLeads.value.length }}</span>
      </div>
      <div class="stat">
        <span class="stat__label">Сумма лидов</span>
        <span class="stat__value">{{ view.formattedSum.value }}</span>
      </div>
    </div>

    <VLeadsTable
      v-model:filters="filters.filters.value"
      :leads="view.leads.value"
      :pipeline-options="options.pipelineOptions.value"
      :status-options="options.statusOptions.value"
      :user-options="options.userOptions.value"
      @reset="filters.resetFilters"
    />
  </template>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  padding: 16px 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat__label {
  font-size: 13px;
  color: var(--p-text-muted-color);
}

.stat__value {
  font-size: 24px;
  font-weight: 600;
  color: var(--p-text-color);
}

.state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 12px;
  color: var(--p-text-muted-color);
}

.error {
  margin-top: 24px;
}
</style>
