import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { CreateActionDto } from './create-action.dto';

export class UpdateActionDto extends PartialType(CreateActionDto) {
  @IsOptional()
  @IsString()
  @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
  status?: string;
}
