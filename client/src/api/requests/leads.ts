import type { Lead } from '@/api/types/lead.type'
import { apiClient } from '../client'

export interface GetLeadsParams {
  page?: number
  limit?: number
}

export interface LeadListResponse {
  _page: number
  _links: {
    self: {
      href: string
    }
  }
  _embedded: {
    leads: Lead[]
  }
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
