import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/createBookingDto';

@Injectable()
export class BookingsService {

        constructor(private prisma:PrismaService){}


        //post /booking/resource/:id
        async createBooking(userId: string, bookingDetails:CreateBookingDto, resourceId: string){
                try {

                    
                    
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
