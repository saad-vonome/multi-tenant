import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @Length(3, 255)
  tenantName: string;

  @IsString()
  @Length(3, 63)
  @Matches(/^[a-z][a-z0-9_]*$/, {
    message:
      'Schema name must start with a letter and contain only lowercase letters, numbers, and underscores',
  })
  tenantSchema: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
