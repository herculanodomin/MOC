import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

const USER_ROLES = [
  'CHANGE_REQUESTER', 'CHANGE_ACCEPTOR', 'CHANGE_OWNER',
  'CHANGE_REVIEW_TEAM', 'CHANGE_APPROVER', 'ADMIN',
] as const;

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsIn(USER_ROLES)
  role: string;

  @IsOptional()
  @IsString()
  department?: string;
}
