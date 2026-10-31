import type { LeadListResponse } from '@/types/lead.type'
import { apiClient } from '../client'

export interface GetLeadsParams {
  page?: number
  limit?: number
}

export function fetchLeads({
  params,
}: {
  params?: GetLeadsParams
} = {}) {
  const { page = 1, limit = 50 } = params ?? {}

  return apiClient.get<LeadListResponse>('/leads', {
    params: { page, limit },
  })
}
