import type { Pipeline } from '@/api/types/pipeline.type'
import { apiClient } from '../client'

export type PipelineResponse = Pipeline[]

export function fetchPipelines() {
  return apiClient.get<PipelineResponse>(`/pipelines/`)
}
