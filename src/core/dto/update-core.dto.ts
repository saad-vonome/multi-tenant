import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantDto } from './create-core.dto';

export class UpdateCoreDto extends PartialType(CreateTenantDto) {}
