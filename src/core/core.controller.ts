import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CoreService } from './core.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Controller('tenants')
export class CoreController {
  constructor(private coreService: CoreService) {}

  @Post()
  async createTenant(@Body() dto: CreateTenantDto) {
    // Create tenant and schema
    const tenant = await this.coreService.createTenant(dto);

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
