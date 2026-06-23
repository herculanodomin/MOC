import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AcceptMocDto {
  @IsBoolean()
  accepted: boolean;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
