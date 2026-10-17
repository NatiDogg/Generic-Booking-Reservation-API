import { Body, Controller,NotFoundException,Param,ParseUUIDPipe,Patch,Post, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ResourceExistPipe } from 'src/resources/pipes/ResourceExistPipe';
import type {  User,Prisma} from 'prisma/generated/prisma/client';
import { CreateBookingDto } from './dto/createBookingDto';
import { jwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { CurrentUser } from 'src/auth/decorators/currentUserDecorator';
import { UpdateBookingDto } from './dto/updateBookingDto';
import { PrismaService } from 'src/prisma/prisma.service';

type ResourceWithRelations = Prisma.ResourceGetPayload<{include: {schedules: true, bookings: true}}>
@Controller('bookings')
export class BookingsController {
        
        constructor(private readonly bookingsService:BookingsService, private prisma:PrismaService){}

        @UseGuards(jwtAuthGuard)
        @Post('resource/:id')
        async createBooking(@Param('id', ParseUUIDPipe, ResourceExistPipe) resource: ResourceWithRelations, @Body() bookingDetails:CreateBookingDto, @CurrentUser() user:Omit<User, 'password'>){
            return await this.bookingsService.createBooking(user.id, bookingDetails, resource  )
        }

        @UseGuards(jwtAuthGuard)
        @Patch(':id')
        async updateBooking(@Param('id',ParseUUIDPipe) bookingId: string, @Body() updateDetails:UpdateBookingDto, @CurrentUser() user:Omit<User, 'password'>){
               const booking = await this.prisma.booking.findUnique({
                where: {id: bookingId},
                include:{
                    resource: {
                        include:{schedules: true,
                            bookings: {where: {startTime: {gte: new Date()}, status: {not: 'CANCELLED'}}}
                        }
                    }
                }
               })

               if(!booking){
                throw new NotFoundException('Booking not found.');
               }

               if(!booking.resource){
                 throw new NotFoundException('Resource associated with this booking not found.');
               }

               return await this.bookingsService.updateBooking(  bookingId,  user.id,  updateDetails,  booking.resource
        );

        }
}
