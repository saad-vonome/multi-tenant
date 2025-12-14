//patients.service.ts

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
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

  async getPatients(): Promise<Patient[]> {
    const patients = await this.patientRepo.find();
    return patients;
  }
}
