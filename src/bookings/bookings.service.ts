import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/createBookingDto';
import { Resource,Prisma } from 'prisma/generated/prisma/client';

type ResourceWithRelations = Prisma.ResourceGetPayload<{include: {bookings: true, schedules: true}}>
@Injectable()
export class BookingsService {

        constructor(private prisma:PrismaService){}


        //post /bookings/resource/:id
        async createBooking(userId: string, bookingDetails:CreateBookingDto, resource: ResourceWithRelations ){
                try {
                 
                   const {} = resource
                
                    
                    
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
