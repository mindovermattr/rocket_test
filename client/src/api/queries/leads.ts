import { fetchLeads } from '@/api/requests/index'
import { useQuery } from '@tanstack/vue-query'

export function useLeadsQuery(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['leads', page, limit],
    queryFn: () => fetchLeads({ page, limit }),
  })
}
