import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('register')
  async registerTenant(@Body() body: { name: string; domain?: string }) {
    return this.tenantService.createTenant(body.name, body.domain);
  }

  @Get()
  async listTenants() {
    return this.tenantService.listTenants();
  }

  @Get(':id')
  async getTenant(@Param('id') id: string) {
    return this.tenantService.getTenant(id);
  }
}
