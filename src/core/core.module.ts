import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { Configuration } from './entities/configuration.entity';
import { Tenant } from './entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Configuration])],
  providers: [CoreService],
  controllers: [CoreController],
  exports: [CoreService],
})
export class CoreModule {}
