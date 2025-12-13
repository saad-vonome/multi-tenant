//patients.service.ts

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantConnectionService } from 'src/tenant/tenant-connection.service';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    private tenantConnection: TenantConnectionService,
  ) {}

  async createPatient(dto: CreatePatientDto): Promise<Patient> {
    // Check if patient already exists
    const existingPatient = await this.patientRepo.findOne({
      where: [{ email: dto.email }],
    });

    if (existingPatient) {
      throw new ConflictException('Patient with this email already exists');
    }
    const newPatient = this.patientRepo.save(dto);
    return newPatient;
  }

  async addPatient(dto: CreatePatientDto): Promise<Patient> {
    return this.tenantConnection.executeInTenantContext(async (manager) => {
      const existingPatient = await manager.findOne(Patient, {
        where: { email: dto.email },
      });

      if (existingPatient) {
        throw new Error('Patient already exists');
      }

      const patient = manager.create(Patient, dto);
      return manager.save(patient);
    });
  }

  // async getPatients(): Promise<Patient[]> {
  //   const patients = await this.patientRepo.find();
  //   return patients;
  // }

  // Then wrap all operations:
  async getPatients(): Promise<Patient[]> {
    return await this.tenantConnection.executeInTenantContext(
      async (manager) => {
        const patients = manager.find(Patient);
        return patients;
      },
    );
  }
}
