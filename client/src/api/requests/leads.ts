import type { LeadListResponse } from '@/types/lead'
import { apiClient } from '../client'

export interface FetchLeadsParams {
  page?: number
  limit?: number
}

export async function fetchLeads({ page = 1, limit = 50 }: FetchLeadsParams = {}) {
  const { data } = await apiClient.get<LeadListResponse>('/leads', {
    params: { page, limit },
  })

  return data
}
