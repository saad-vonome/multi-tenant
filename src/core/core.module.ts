import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';

@Module({
  imports: [],
  providers: [CoreService],
  controllers: [CoreController],
  exports: [CoreService],
})
export class CoreModule {}
