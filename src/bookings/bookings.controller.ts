import { Body, Controller,Param,ParseUUIDPipe,Post, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ResourceExistPipe } from 'src/resources/pipes/ResourceExistPipe';
import type { Resource, User } from 'prisma/generated/prisma/client';
import { CreateBookingDto } from './dto/createBookingDto';
import { jwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { CurrentUser } from 'src/auth/decorators/currentUserDecorator';

@Controller('bookings')
export class BookingsController {

        constructor(private readonly bookingsService:BookingsService){}

        @UseGuards(jwtAuthGuard)
        @Post('resource/:id')
        async createBooking(@Param('id', ParseUUIDPipe, ResourceExistPipe) resource: Resource, @Body() bookingDetails:CreateBookingDto, @CurrentUser() user:Omit<User, 'password'>){
            return await this.bookingsService.createBooking(user.id, bookingDetails, resource  )
        }
}
