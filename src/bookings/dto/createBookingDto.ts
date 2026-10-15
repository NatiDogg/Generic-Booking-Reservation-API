import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class CreateBookingDto{

    
    @IsNotEmpty({message: 'Start Time is required'})
    @Type(()=> Date)
    @IsDate({message: 'Start time must be a valid ISO Date'})
    startTime!: Date

    @IsNotEmpty({message: 'End Time is required'})
    @Type(()=> Date)
    @IsDate({message: 'End time must be a valid ISO Date'})
    endTime!: Date

            
} 


//post /booking/resource/:id