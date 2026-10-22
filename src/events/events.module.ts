import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventsService } from './userEventsService';

@Module({
    imports: [
        EventEmitterModule.forRoot({
           global: true,
           wildcard: false,
           maxListeners: 30,
           verboseMemoryLeak: true

    })],
    providers: [UserEventsService],
    exports: [UserEventsService]
})
export class EventsModule {}
