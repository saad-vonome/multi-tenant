import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource, EntityManager } from 'typeorm';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

@Injectable({ scope: Scope.REQUEST })
export class TenantConnectionService {
  private entityManager: EntityManager;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private dataSource: DataSource,
  ) {}

  getTenantSchema(): string {
    return this.request['tenantSchema'];
  }

  async getConnection(): Promise<EntityManager> {
    if (this.entityManager) {
      return this.entityManager;
    }

    const tenantSchema = this.getTenantSchema();

    if (!tenantSchema) {
      throw new Error('Tenant schema not found in request');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(`SET search_path TO "${tenantSchema}"`);

    this.entityManager = queryRunner.manager;
    return this.entityManager;
  }

  async executeInTenantContext<T>(
    callback: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const manager = await this.getConnection();
    return callback(manager);
  }
}
