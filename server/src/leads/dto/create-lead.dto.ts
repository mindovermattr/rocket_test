import { Lead } from '../entity/lead.entity';

export class CreateLeadDto {
  name!: string;
  price?: number;
  pipeline_id?: number;
  status_id?: number;
}

export class LeadResponseDto {
  _embedded?: {
    leads?: Array<Lead & { id: number }>;
  };
}
