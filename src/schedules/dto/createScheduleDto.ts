import {IsDate, IsEnum, IsNotEmpty} from 'class-validator'
import {Type} from 'class-transformer'
import { DayOfWeek } from "prisma/generated/prisma/enums";
export class CreateScheduleDto{
    
       @IsNotEmpty({message: 'Day of week is required'})
       @IsEnum(DayOfWeek, {message: 'Day of week must be a valid Day Of Week value'})
       dayOfWeek!: DayOfWeek

       @IsNotEmpty({ message: 'Start time is required' })
       @Type(() => Date)
       @IsDate({ message: 'Start time must be a valid ISO Date' })
       startTime!: Date

        @IsNotEmpty({ message: 'End time is required' })
        @Type(()=> Date)
        @IsDate({ message: 'End time must be a valid ISO Date' })
        endTime!: Date



      
}






