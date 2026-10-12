import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { AuthCommonModule } from 'src/auth-shared-module/auth-shared-module.module';

@Module({
  providers: [SchedulesService],
  controllers: [SchedulesController],
  imports:[AuthCommonModule],
  exports: [SchedulesService],
  
})
export class SchedulesModule {}
