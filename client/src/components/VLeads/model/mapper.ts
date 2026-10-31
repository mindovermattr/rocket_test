import type { PipelineResponse } from '@/api/requests'
import type { UsersResponse } from '@/api/requests/users'
import type { Lead } from '@/api/types/lead.type'

export const mapLeads = (leads: Lead[], pipelines: PipelineResponse, users: UsersResponse) => {
  return leads.map((lead) => {
    const pipeline = pipelines.find((p) => p.id === lead.pipeline_id)
    const userName = users.find((user) => user.id === lead.responsible_user_id)?.name
    return {
      ...lead,
      statusName: pipeline?.statuses.find((apiStatus) => apiStatus.id === lead.status_id)?.name,
      pipelineName: pipeline?.pipelineName,
      responsibleUserName: userName,
    }
  })
}
