<script setup lang="ts">
import { dateFormatter, priceFormatter } from '@/lib/formatters'
import type { Lead } from '@/types/lead'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

const props = defineProps<{
  leads: Lead[]
}>()

const formatPrice = (price: Lead['price']) => priceFormatter.format(price)

const formatDate = (createdAt: Lead['created_at']) =>
  dateFormatter.format(new Date(createdAt * 1000))
</script>

<template>
  <DataTable :value="props.leads" dataKey="id" stripedRows>
    <Column field="id" header="ID" />
    <Column field="name" header="Название" />
    <Column field="price" header="Сумма" sortable>
      <template #body="{ data }">
        {{ formatPrice(data.price) }}
      </template>
    </Column>
    <Column field="created_at" header="Создан" sortable>
      <template #body="{ data }">
        {{ formatDate(data.created_at) }}
      </template>
    </Column>
    <Column field="status_id" header="Статус" />
    <Column field="pipeline_id" header="Воронка" />
  </DataTable>
</template>

<style scoped></style>
