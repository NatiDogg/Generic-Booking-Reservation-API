import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Resource } from "prisma/generated/prisma/client";

export interface ResourceUpdatedEvent {
  oldResource: Resource;
  updatedResource: Resource;
  timestamp?: Date;
}

@Injectable()
export class ResourceEventsService{
     
    constructor( private readonly eventEmitter:EventEmitter2){}

    emitResourceUpdated(resource:ResourceUpdatedEvent){
        const updatedResource:ResourceUpdatedEvent = {
             oldResource: resource.oldResource,
             updatedResource: resource.updatedResource,
             timestamp: new Date()
        }

        this.eventEmitter.emit('event.updated', updatedResource)
    }

}