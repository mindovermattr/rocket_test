import { PartialType } from '@nestjs/mapped-types';
import { CreateAmoDto } from './create-amo.dto';

export class UpdateAmoDto extends PartialType(CreateAmoDto) {}
