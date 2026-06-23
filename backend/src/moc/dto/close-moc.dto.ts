import { IsString, IsOptional } from 'class-validator';

export class CloseMocDto {
  @IsString()
  result: string;

  @IsOptional()
  @IsString()
  issuesFound?: string;

  @IsOptional()
  @IsString()
  lessonsLearned?: string;
}
