import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { AuthCommonModule } from 'src/auth-shared-module/auth-shared-module.module';

@Module({
  providers: [ResourcesService],
  controllers: [ResourcesController],
  imports: [SchedulesModule, AuthCommonModule]
})
export class ResourcesModule {}
