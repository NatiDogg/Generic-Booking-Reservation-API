import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/createBookingDto';
import { Resource,Prisma, DayOfWeek } from 'prisma/generated/prisma/client';

type ResourceWithRelations = Prisma.ResourceGetPayload<{include: {bookings: true, schedules: true}}>
@Injectable()
export class BookingsService {
         private daysMap:DayOfWeek[] = [ 'SUNDAY',
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY']

        constructor(private prisma:PrismaService){}


        //post /bookings/resource/:id
        async createBooking(userId: string, bookingDetails:CreateBookingDto, resource: ResourceWithRelations ){
                try {
                 const {startTime, endTime} = bookingDetails
                 const bookingDates = {
                         startDate: new Date(startTime),
                         endDate: new Date(endTime)
                 }
                 const startDayOfWeek = this.daysMap[ bookingDates.startDate.getUTCDay()]
                 const endDayofWeek = this.daysMap[bookingDates.endDate.getUTCDay()]
                 const validResourceSchedule = resource.schedules.find((schedule)=> {

                        return (schedule.dayOfWeek === startDayOfWeek && schedule.dayOfWeek === endDayofWeek) && schedule.startTime >=bookingDates.startDate && schedule.endTime <= bookingDates.endDate
                 }
                )

                  




                
                    
                    
                } catch (error) {
                    throw error
                }       
        } 
         //patch /booking/:id
        async updateBooking(){

        }
        //get /booking/
        async getBookings(){

        }

        //get /booking/:id
        async getBooking(){

        }
       
           //patch /booking/:id/status
        async changeBookingStatus(){

        }

         //delete /booking/:id
        async deleteBooking(){

        }

}
