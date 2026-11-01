<script setup lang="ts">
import type { Lead } from '@/api/types/lead.type'
import { dateFormatter, priceFormatter } from '@/lib/formatters'
import { apiLeadUrlToDetail } from '@/lib/link'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputNumber from 'primevue/inputnumber'
import MultiSelect from 'primevue/multiselect'
import { computed } from 'vue'
import type { BudgetRange, LeadsFilterOption, LeadsFilters } from './model/filters'

const props = defineProps<{
  leads: Lead[]
  filters: LeadsFilters
  pipelineOptions: LeadsFilterOption[]
  statusOptions: LeadsFilterOption[]
  userOptions: LeadsFilterOption[]
}>()

const emit = defineEmits<{
  reset: []
  'update:filters': [filters: LeadsFilters]
}>()

type FilterField = 'pipeline_id' | 'status_id' | 'responsible_user_id' | 'price'

const updateFilter = (field: FilterField, value: unknown) => {
  emit('update:filters', {
    ...props.filters,
    [field]: { ...props.filters[field], value },
  })
}

const selectedIds = (field: Exclude<FilterField, 'price'>) =>
  (props.filters[field].value as number[] | null) ?? []

const pipelineIds = computed({
  get: () => selectedIds('pipeline_id'),
  set: (value: number[]) => updateFilter('pipeline_id', value.length ? value : null),
})

const statusIds = computed({
  get: () => selectedIds('status_id'),
  set: (value: number[]) => updateFilter('status_id', value.length ? value : null),
})

const responsibleIds = computed({
  get: () => selectedIds('responsible_user_id'),
  set: (value: number[]) => updateFilter('responsible_user_id', value.length ? value : null),
})

const budgetFrom = computed({
  get: () => (props.filters.price.value as BudgetRange)[0],
  set: (value: number | null) => {
    const [, to] = props.filters.price.value as BudgetRange
    updateFilter('price', [value, to])
  },
})

const budgetTo = computed({
  get: () => (props.filters.price.value as BudgetRange)[1],
  set: (value: number | null) => {
    const [from] = props.filters.price.value as BudgetRange
    updateFilter('price', [from, value])
  },
})

const formatPrice = (price: Lead['price']) => priceFormatter.format(price)

const formatDate = (createdAt: Lead['created_at']) =>
  dateFormatter.format(new Date(createdAt * 1000))
</script>

<template>
  <DataTable :value="props.leads" :filters="props.filters" dataKey="id" stripedRows>
    <template #header>
      <div class="table-header">
        <div class="table-header__top">
          <span class="table-header__title">Лиды</span>
          <Button
            label="Сбросить"
            icon="pi pi-filter-slash"
            severity="secondary"
            text
            size="small"
            @click="emit('reset')"
          />
        </div>
        <div class="filters">
          <label class="filter">
            <span class="filter__label">Воронка</span>
            <MultiSelect
              v-model="pipelineIds"
              :options="props.pipelineOptions"
              optionLabel="label"
              optionValue="id"
              placeholder="Все"
              display="chip"
              filter
              :maxSelectedLabels="1"
              class="filter__control"
            />
          </label>
          <label class="filter">
            <span class="filter__label">Этап</span>
            <MultiSelect
              v-model="statusIds"
              :options="props.statusOptions"
              optionLabel="label"
              optionValue="id"
              placeholder="Все"
              display="chip"
              filter
              :maxSelectedLabels="1"
              class="filter__control"
            />
          </label>
          <label class="filter">
            <span class="filter__label">Ответственный</span>
            <MultiSelect
              v-model="responsibleIds"
              :options="props.userOptions"
              optionLabel="label"
              optionValue="id"
              placeholder="Все"
              display="chip"
              filter
              :maxSelectedLabels="1"
              class="filter__control"
            />
          </label>
          <div class="filter filter--budget">
            <span class="filter__label">Бюджет</span>
            <div class="range-filter">
              <InputNumber
                v-model="budgetFrom"
                placeholder="от"
                :min="0"
                :useGrouping="false"
                class="range-filter__input"
              />
              <InputNumber
                v-model="budgetTo"
                placeholder="до"
                :min="0"
                :useGrouping="false"
                class="range-filter__input"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <Column field="id" header="ID">
      <template #body="{ data }">
        <a class="link" :href="apiLeadUrlToDetail(data._links.self.href)">{{ data.id }}</a>
      </template>
    </Column>
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
    <Column field="statusName" header="Статус" />
    <Column field="pipelineName" header="Воронка" />
    <Column field="responsibleUserName" header="Ответственный" />
  </DataTable>
</template>

<style scoped>
.link {
  text-decoration: underline;
}

.table-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 12px;
}

.table-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.table-header__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--p-text-color);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.filter__label {
  font-size: 12px;
  color: var(--p-text-muted-color);
}

.filter__control {
  width: 100%;
}

.range-filter {
  display: flex;
  gap: 4px;
}

.range-filter__input {
  width: 100%;
}
</style>
