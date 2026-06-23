import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateActionDto {
  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsInt()
  responsibleId: number;
}
