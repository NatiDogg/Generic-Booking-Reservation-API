import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { User } from "prisma/generated/prisma/client";

export interface UserRegisteredEvent{
      user: {
          id: string,
          email: string,
          
      },
      timeStamp: Date
}
@Injectable()


export class UserEventsService{

       constructor( private readonly eventEmitter: EventEmitter2){}

       // emit an user registered event

       emitUserRegistered(user: Omit<User, 'password'>): void{
             const userRegisteredEventData: UserRegisteredEvent = {
                  user: {id: user.id, email: user.email},
                  timeStamp: new Date()
             }


             //takes event name and event Data
             this.eventEmitter.emit('user.registered', userRegisteredEventData)
       }




}