import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateRiskDto {
  @IsString()
  hazard: string;

  @IsString()
  consequence: string;

  @IsInt()
  @Min(1)
  @Max(5)
  probability: number;

  @IsInt()
  @Min(1)
  @Max(5)
  severity: number;

  @IsString()
  mitigation: string;
}
