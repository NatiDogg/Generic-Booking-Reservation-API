import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { ResourceUpdatedEvent } from '../resourceEventsService';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResourceEventsListener {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(ResourceEventsListener.name);

  @OnEvent('event.updated')
  async handleResourceUpdatedEvent(resource: ResourceUpdatedEvent) {
    const affectedBookings = await this.prisma.booking.findMany({
      where: {
        resourceId: resource.updatedResource.id,
        endTime: { gte: new Date() },
        status: { not: 'CANCELLED' },
      },
      include: {
        user: true, 
      },
    });

    if(affectedBookings.length === 0) return 

    const changes: string[] = [];

    if (resource.oldResource.name !== resource.updatedResource.name) {
      changes.push(`Resource Name changed from "${resource.oldResource.name}" to "${resource.updatedResource.name}"`);
    }

    if (resource.oldResource.location !== resource.updatedResource.location) {
      changes.push(`Resource Location changed from "${resource.oldResource.location}" to "${resource.updatedResource.location}"`);
    }

    if (resource.oldResource.description !== resource.updatedResource.description) {
      changes.push(`Resource: ${resource.updatedResource.name}Description has been updated.`);
    }

   
    if (changes.length === 0) return;

     for(const booking of affectedBookings){
         const userEmail = booking.user.email
         const changeSummary = changes.join(', ');
         this.logger.log(`Notifying ${userEmail}: Your booked resource was updated. Changes: ${changeSummary}`)
     }
    


  }
}
