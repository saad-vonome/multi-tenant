import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { CoreModule } from './core/core.module';
import { TenantMiddleware } from './middleware/tenant.middleware';
import { PatientsModule } from './patients/patients.module';
import { TenantContextService } from './tenant/tenant-context.service';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    CoreModule,
    TenantModule,
    PatientsModule,
  ],
  providers: [TenantContextService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude('/api/tenants/(.*)', '/health', '/api/docs/(.*)')
      .forRoutes('*');
  }
}
