import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OAuthQueryDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsOptional()
  @IsString()
  referer?: string;

  @IsOptional()
  @IsString()
  platform?: string;
}
