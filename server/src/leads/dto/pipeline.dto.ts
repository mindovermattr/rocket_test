export class PipelineStatusDto {
  id!: number;
  name!: string;
}

export class PipelineDto {
  id!: number;
  pipelineName!: string;
  statuses!: PipelineStatusDto[];
}
