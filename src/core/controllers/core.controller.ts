import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { CoreService } from '../services/core.service';

@Controller('api/tenants')
export class CoreController {
  constructor(private coreService: CoreService) {}

  @Post()
  async createTenant(@Body() createTenantDto: CreateTenantDto) {
    // Create tenant and schema
    const tenant = await this.coreService.createTenant(createTenantDto);

    return {
      message: 'Tenant created successfully',
      tenant,
    };
  }

  @Get()
  async getAllTenants() {
    return this.coreService.getAllTenants();
  }

  @Get(':id')
  async getTenant(@Param('id') id: string) {
    return this.coreService.getTenantBySchema(id);
  }
}
