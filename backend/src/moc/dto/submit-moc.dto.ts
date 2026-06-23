import { IsInt, IsOptional } from 'class-validator';

export class SubmitMocDto {
  @IsInt()
  acceptorId: number;

  @IsOptional()
  @IsInt()
  ownerId?: number;
}
