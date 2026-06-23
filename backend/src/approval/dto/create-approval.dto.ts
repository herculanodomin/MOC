import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateApprovalDto {
  @IsBoolean()
  isApproved: boolean;

  @IsOptional()
  @IsString()
  comments?: string;
}
