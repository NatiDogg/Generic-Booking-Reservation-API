import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { SchedulesModule } from 'src/schedules/schedules.module';

@Module({
  providers: [ResourcesService],
  controllers: [ResourcesController],
  imports: [SchedulesModule]
})
export class ResourcesModule {}
