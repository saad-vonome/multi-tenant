import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { TenantMiddleware } from './middleware/tenant.middleware';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [CoreModule, PatientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude('/api/tenants/(.*)', '/health', '/api/docs/(.*)')
      .forRoutes('*');
  }
}
