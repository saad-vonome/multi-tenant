import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreController } from './controllers/core.controller';
import { Configuration } from './entities/configuration.entity';
import { Tenant } from './entities/tenant.entity';
import { CoreService } from './services/core.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Configuration])],
  providers: [CoreService],
  controllers: [CoreController],
  exports: [CoreService],
})
export class CoreModule {}
