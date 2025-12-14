import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tenant } from 'generated/prisma/browser';
import { PrismaClient } from 'generated/prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { CreateTenantDto } from './dto/create-core.dto';

@Injectable()
export class CoreService {
  constructor(private readonly prisma: PrismaClient) {}

  async createTenant(dto: CreateTenantDto): Promise<Tenant> {
    // Check if tenant already exists
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { email: dto.email },
    });

    if (existingTenant) {
      throw new ConflictException(
        'Tenant with this schema or subdomain already exists',
      );
    }

    // Create tenant record
    const tenant = await this.prisma.tenant.create({
      data: {
        ...dto,
        isActive: true,
        schemaName: uuidv4(),
      },
    });

    // Create schema
    await this.createTenantSchema(tenant.id);

    return tenant;
  }

  async getTenantBySchema(schemaName: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { schemaName },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found or inactive');
    }

    return tenant;
  }

  async getAllTenants(): Promise<Tenant[]> {
    return this.prisma.tenant.findMany({ where: { isActive: true } });
  }

  private async createTenantSchema(schemaName: string): Promise<void> {
    try {
      // Create schema
      await this.prisma.$executeRawUnsafe(
        `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`,
      );

      // You can add initial tables here or handle via migrations
      console.log(`Schema ${schemaName} created successfully`);
    } catch (error) {
      console.error(`Error creating schema ${schemaName}:`, error);
      throw error;
    }
  }
}
