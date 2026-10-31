export interface Status {
  id: number
  name: string
}

export interface PipelineResponse {
  id: number
  pipelineName: string
  statuses: Status[]
}
