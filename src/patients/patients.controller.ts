import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePatientDto) {
    return await this.patientsService.createPatient(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.patientsService.getPatients();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.patientsService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
  //   return this.patientsService.update(id, updatePatientDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.patientsService.remove(id);
  // }
}
