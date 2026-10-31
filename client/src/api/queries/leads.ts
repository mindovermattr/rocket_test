import { fetchLeads, type GetLeadsParams } from '@/api/requests/index'
import { useQuery } from '@tanstack/vue-query'

export function useLeadsQuery(params?: GetLeadsParams) {
  return useQuery({
    queryKey: ['leads', params?.page, params?.limit],
    queryFn: () => fetchLeads({ params }),
    select: (response) => response.data,
  })
}
