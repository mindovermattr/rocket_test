import type { PipelineResponse } from '@/types/pipeline.type'
import { apiClient } from '../client'

export function fetchPipelines() {
  return apiClient.get<PipelineResponse[]>(`/leads/pipelines/`)
}
