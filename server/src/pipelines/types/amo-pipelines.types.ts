export interface AmoCrmPipelineStatus {
  id: number;
  name: string;
  sort: number;
}

export interface AmoCrmPipeline {
  id: number;
  name: string;
  sort: number;
  _embedded?: {
    statuses?: AmoCrmPipelineStatus[];
  };
}

export interface AmoCrmPipelinesResponse {
  _embedded?: {
    pipelines?: AmoCrmPipeline[];
  };
}
