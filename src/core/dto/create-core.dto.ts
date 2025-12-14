import { IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  email: string;

  @IsString()
  name: string;
}
