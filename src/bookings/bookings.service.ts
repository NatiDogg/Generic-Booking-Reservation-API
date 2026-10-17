import { ConflictException, Injectable } from '@nestjs/common';
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

                if(!validResourceSchedule){
                        throw new ConflictException('')
                }

                // i am going to check if the booking starttime and endTime is not in the range of already Booked resource
                const isResourceBooked = resource.bookings.find((booking)=>{

                    if(booking.startTime >= new Date() && (booking.status === 'PENDING' || booking.status === 'CONFIRMED')){
                      return (startDayOfWeek === this.daysMap[new Date(booking.startTime).getUTCDay()]  ) && (bookingDates.startDate <= booking.startTime)

                     }

                   
                })



                  




                
                    
                    
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
