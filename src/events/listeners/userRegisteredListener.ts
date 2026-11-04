import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import type { UserRegisteredEvent } from "../userEventsService";


@Injectable()

//this listener class respond to the events emitted by the event emitter
export class UserRegisteredListener{

    private readonly logger = new Logger(UserRegisteredListener.name)

    @OnEvent('user.registered')
    handleUserRegisteredEvent(event:UserRegisteredEvent){
      const {user, timeStamp} = event

      this.logger.log(`Welcome, ${user.email}! your Account created at ${timeStamp}`)

    }


}