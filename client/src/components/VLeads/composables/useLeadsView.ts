import { useLeadsQuery } from '@/api/queries/leads'
import { usePipelinesQuery } from '@/api/queries/pipeline'
import { useUsersQuery } from '@/api/queries/users'
import type { Lead } from '@/api/types/lead.type'
import { priceFormatter } from '@/lib/formatters'
import { computed, ref, watch } from 'vue'
import {
  createLeadsFilters,
  filterLeads,
  type LeadsFilterOption,
  type LeadsFilters,
} from '../model/filters'
import { mapLeads } from '../model/mapper'

export function useLeadsView() {
  const leadsQuery = useLeadsQuery()
  const pipelineQuery = usePipelinesQuery()
  const usersQuery = useUsersQuery()

  const pipelines = computed(() => pipelineQuery.data.value ?? [])

  const mapped = computed<{ leads: Lead[]; error: Error | null }>(() => {
    const data = leadsQuery.data.value

    if (!data) return { leads: [], error: null }

    try {
      return {
        leads: mapLeads(data._embedded.leads, pipelines.value, usersQuery.data.value ?? []),
        error: null,
      }
    } catch (e) {
      console.error('mapLeads failed', e)
      return { leads: [], error: e as Error }
    }
  })

  const leads = computed(() => mapped.value.leads)
  const mappingError = computed(() => mapped.value.error)

  const filters = ref<LeadsFilters>(createLeadsFilters())
  const resetFilters = () => {
    filters.value = createLeadsFilters()
  }

  const pipelineOptions = computed<LeadsFilterOption[]>(() =>
    pipelines.value.map((p) => ({ id: p.id, label: p.pipelineName })),
  )
  const userOptions = computed<LeadsFilterOption[]>(() =>
    (usersQuery.data.value ?? []).map((u) => ({ id: u.id, label: u.name })),
  )

  const selectedPipelineIds = computed(
    () => (filters.value.pipeline_id.value as number[] | null) ?? [],
  )

  const statusOptions = computed<LeadsFilterOption[]>(() => {
    const selected = selectedPipelineIds.value
    const source = selected.length
      ? pipelines.value.filter((p) => selected.includes(p.id))
      : pipelines.value

    const statuses = new Map<number, string>()

    source.forEach((p) => p.statuses.forEach((s) => statuses.set(s.id, s.name)))

    return [...statuses].map(([id, label]) => ({ id, label }))
  })

  watch(selectedPipelineIds, () => {
    const allowed = new Set(statusOptions.value.map((s) => s.id))

    const selectedStatuses = filters.value.status_id.value

    if (selectedStatuses?.some((id: number) => !allowed.has(id))) {
      filters.value.status_id.value = selectedStatuses.filter((id: number) => allowed.has(id))
    }
  })

  const filteredLeads = computed(() => filterLeads(leads.value, filters.value))
  const sum = computed(() => filteredLeads.value.reduce((a, l) => a + l.price, 0))
  const formattedSum = computed(() => priceFormatter.format(sum.value))

  const isLoading = computed(() => leadsQuery.isPending.value)
  const isError = computed(() => leadsQuery.isError.value)
  const errorMessage = computed(() => leadsQuery.error.value?.message)

  const retry = () => {
    leadsQuery.refetch()
    usersQuery.refetch()
    pipelineQuery.refetch()
  }

  return {
    view: {
      leads,
      filteredLeads,
      sum,
      formattedSum,
    },
    filters: {
      filters,
      resetFilters,
    },
    options: {
      pipelineOptions,
      userOptions,
      statusOptions,
    },
    state: {
      isLoading,
      isError,
      errorMessage,
      mappingError,
    },
    actions: {
      retry,
    },
  }
}
