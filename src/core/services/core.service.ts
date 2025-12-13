import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { Configuration } from '../entities/configuration.entity';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class CoreService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(Configuration)
    private configurationRepository: Repository<Configuration>,
    private dataSource: DataSource,
  ) {}

  async createTenant(createTenantDto: CreateTenantDto): Promise<Tenant> {
    // Check if tenant already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: [{ tenantSchema: createTenantDto.tenantSchema }],
    });

    if (existingTenant) {
      throw new ConflictException(
        'Tenant with this schema or subdomain already exists',
      );
    }

    // Create tenant record
    const tenant = this.tenantRepository.create(createTenantDto);
    const savedTenant = await this.tenantRepository.save(tenant);

    // Create schema
    await this.createTenantSchema(savedTenant.tenantSchema);

    return savedTenant;
  }

  async getTenantBySchema(schema: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenantSchema: schema, isActive: true },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found or inactive');
    }

    return tenant;
  }

  async getTenantBySubdomain(subdomain: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { subdomain, isActive: true },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found or inactive');
    }

    return tenant;
  }

  async getAllTenants(): Promise<Tenant[]> {
    return this.tenantRepository.find({ where: { isActive: true } });
  }

  private async createTenantSchema(schemaName: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Create schema
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

      // You can add initial tables here or handle via migrations
      console.log(`Schema ${schemaName} created successfully`);
    } catch (error) {
      console.error(`Error creating schema ${schemaName}:`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async setConfiguration(
    tenantId: string,
    configKey: string,
    configValue: any,
  ): Promise<Configuration> {
    let config = await this.configurationRepository.findOne({
      where: { tenantId, configKey },
    });

    if (config) {
      config.configValue = configValue;
    } else {
      config = this.configurationRepository.create({
        tenantId,
        configKey,
        configValue,
      });
    }

    return this.configurationRepository.save(config);
  }

  async getConfiguration(
    tenantId: string,
    configKey: string,
  ): Promise<Configuration> {
    return this.configurationRepository.findOne({
      where: { tenantId, configKey },
    }) as any;
  }
}
