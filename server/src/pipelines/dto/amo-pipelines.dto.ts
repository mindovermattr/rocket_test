export interface AmoCrmPipelineStatusDto {
  id: number;
  name: string;
  sort: number;
}

export interface AmoCrmPipelineDto {
  id: number;
  name: string;
  sort: number;
  _embedded?: {
    statuses?: AmoCrmPipelineStatusDto[];
  };
}

export interface AmoCrmPipelinesResponseDto {
  _embedded?: {
    pipelines?: AmoCrmPipelineDto[];
  };
}
