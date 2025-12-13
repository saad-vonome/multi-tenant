import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantContextService } from 'src/tenant/tenant-context.service';
import { TenantModule } from '../tenant/tenant.module';
import { Patient } from './entities/patient.entity';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

@Module({
  imports: [TenantModule, TypeOrmModule.forFeature([Patient])],
  controllers: [PatientsController],
  providers: [PatientsService, TenantContextService],
  exports: [PatientsService],
})
export class PatientsModule {}
