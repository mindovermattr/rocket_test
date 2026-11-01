import type { Lead } from '@/api/types/lead.type'
import { FilterService } from '@primevue/core/api'
import type { DataTableFilterMeta, DataTableFilterMetaData } from 'primevue/datatable'

export type BudgetRange = [number | null, number | null]

export interface LeadsFilters extends DataTableFilterMeta {
  pipeline_id: DataTableFilterMetaData
  status_id: DataTableFilterMetaData
  responsible_user_id: DataTableFilterMetaData
  price: DataTableFilterMetaData
}

export interface LeadsFilterOption {
  id: number
  label: string
}

const emptyBudgetRange = (): BudgetRange => [null, null]

export const createLeadsFilters = (): LeadsFilters => ({
  pipeline_id: { value: null, matchMode: 'in' },
  status_id: { value: null, matchMode: 'in' },
  responsible_user_id: { value: null, matchMode: 'in' },
  price: { value: emptyBudgetRange(), matchMode: 'priceRange' },
})

const isBudgetMatch = (price: number, range: BudgetRange) => {
  const [from, to] = range

  if (from != null && price < from) {
    return false
  }

  if (to != null && price > to) {
    return false
  }

  return true
}

FilterService.register('priceRange', (value: number, filter: BudgetRange) => {
  if (value == null) {
    return false
  }

  return isBudgetMatch(value, filter ?? emptyBudgetRange())
})

const isIdMatch = (id: number, ids: number[] | null) => !ids?.length || ids.includes(id)

export const filterLeads = (leads: Lead[], filters: LeadsFilters) => {
  const pipelineIds = filters.pipeline_id.value as number[] | null
  const statusIds = filters.status_id.value as number[] | null
  const responsibleIds = filters.responsible_user_id.value as number[] | null
  const budgetRange = filters.price.value as BudgetRange

  return leads.filter(
    (lead) =>
      isIdMatch(lead.pipeline_id, pipelineIds) &&
      isIdMatch(lead.status_id, statusIds) &&
      isIdMatch(lead.responsible_user_id, responsibleIds) &&
      isBudgetMatch(lead.price, budgetRange),
  )
}
