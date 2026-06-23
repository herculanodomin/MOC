import { IsString, IsOptional } from 'class-validator';

export class CreateMocDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  changeType: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  responsibleArea?: string;

  @IsString()
  justification: string;
}
