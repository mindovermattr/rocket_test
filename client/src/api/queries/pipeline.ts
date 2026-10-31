import { useQuery } from '@tanstack/vue-query'
import { fetchPipelines } from '../requests/pipeline'

export function usePipelinesQuery() {
  return useQuery({
    queryKey: ['pipelines'],
    queryFn: () => fetchPipelines(),
    select: (response) => response.data,
  })
}
