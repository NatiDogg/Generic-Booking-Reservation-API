import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { AuthCommonModule } from 'src/auth-shared-module/auth-shared-module.module';

@Module({
  providers: [BookingsService],
  controllers: [BookingsController],
  imports:[AuthCommonModule]
})
export class BookingsModule {}
