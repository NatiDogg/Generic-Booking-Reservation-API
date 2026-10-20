
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { STATUS } from "prisma/generated/prisma/enums";


export class ChangeBookingStatusDto{

     @IsNotEmpty({message: 'Status is required'})
     @IsEnum(STATUS, {message: 'Status must be either Confirmed or Cancalled'})
     //STATUS = "PENDING" | "CONFIRMED" | "CANCELLED"
      status!: STATUS
}