export interface PipelineStatus {
  id: number
  name: string
}

export interface Pipeline {
  id: number
  pipelineName: string
  statuses: PipelineStatus[]
}
