import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventsService } from './userEventsService';
import { UserRegisteredListener } from './listeners/userRegisteredListener';
import { ResourceEventsListener } from './listeners/resourceEventsListener';
import { ResourceEventsService } from './resourceEventsService';

@Module({
    imports: [
        EventEmitterModule.forRoot({
           global: true,
           wildcard: false,
           maxListeners: 30,
           verboseMemoryLeak: true

    })],
    providers: [UserEventsService,UserRegisteredListener, ResourceEventsListener, ResourceEventsService],
    exports: [UserEventsService]
})
export class EventsModule {}
