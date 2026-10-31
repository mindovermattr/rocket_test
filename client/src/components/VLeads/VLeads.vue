<script setup lang="ts">
import { useLeadsQuery } from '@/api/queries/leads'
import { usePipelinesQuery } from '@/api/queries/pipeline'
import { useUsersQuery } from '@/api/queries/users'
import { priceFormatter } from '@/lib/formatters'
import ProgressSpinner from 'primevue/progressspinner'
import { computed } from 'vue'
import VError from '../VError.vue'
import VLeadsTable from './VLeadsTable.vue'
import { mapLeads } from './model/mapper'

const { data, isPending, isError, error, refetch } = useLeadsQuery()
const pipelineQuery = usePipelinesQuery()
const usersQuery = useUsersQuery()

const leads = computed(() =>
  mapLeads(
    data?.value?._embedded.leads ?? [],
    pipelineQuery.data.value!,
    usersQuery.data.value ?? [],
  ),
)

const sum = computed(() => leads.value.reduce((acc, lead) => acc + lead.price, 0))
const formattedSum = computed(() => priceFormatter.format(sum.value))
</script>

<template>
  <div v-if="isPending" class="state">
    <ProgressSpinner style="width: 40px; height: 40px" :strokeWidth="4" />
    <span>Загрузка...</span>
  </div>
  <VError
    v-else-if="isError"
    title="Не удалось загрузить лиды"
    :message="error?.message"
    class="error"
    @retry="refetch()"
  />
  <template v-else>
    <div class="stats">
      <div class="stat">
        <span class="stat__label">Количество лидов</span>
        <span class="stat__value">{{ leads.length }}</span>
      </div>
      <div class="stat">
        <span class="stat__label">Сумма лидов</span>
        <span class="stat__value">{{ formattedSum }}</span>
      </div>
    </div>
    <VLeadsTable :leads="leads" />
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
