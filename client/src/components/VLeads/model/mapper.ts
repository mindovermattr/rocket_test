import type { Lead } from '@/types/lead.type'
import type { PipelineResponse } from '@/types/pipeline.type'
import type { UseQueryReturnType } from '@tanstack/vue-query'

export const mapLeads = (
  leads: Lead[],
  pipelines: PipelineResponse[],
) =>
  (leads ?? []).map((lead) => {
    const pipeline = pipelines.find((p) => p.id === lead.pipeline_id)
    return {
      ...lead,
      statusName: pipeline?.statuses.find((apiStatus) => apiStatus.id === lead.status_id)?.name,
      pipelineName: pipeline?.pipelineName,
    }
  })
