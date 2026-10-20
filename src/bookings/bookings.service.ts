import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/createBookingDto';
import {  Prisma, DayOfWeek,Role, User } from 'prisma/generated/prisma/client';

import { UpdateBookingDto } from './dto/updateBookingDto';
import { ChangeBookingStatusDto } from './dto/changeBookingStatusDto';

type ResourceWithRelations = Prisma.ResourceGetPayload<{
  include: { bookings: true; schedules: true };
}>;
@Injectable()
export class BookingsService {
  private daysMap: DayOfWeek[] = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];

  constructor(private prisma: PrismaService) {}

  //post /bookings/resource/:id
  async createBooking(
    userId: string,
    bookingDetails: CreateBookingDto,
    resource: ResourceWithRelations,
  ) {
    try {
      const { startTime, endTime } = bookingDetails;
      const bookingDates = {
        startDate: new Date(startTime),
        endDate: new Date(endTime),
      };
      if (bookingDates.startDate >= bookingDates.endDate) {
        throw new BadRequestException(
          'Booking start time must be strictly before the end time.',
        );
      }
      if (bookingDates.startDate < new Date()) {
        throw new BadRequestException(
          'Cannot create a booking for a time in the past.',
        );
      }
      const startDayOfWeek = this.daysMap[bookingDates.startDate.getUTCDay()];
      const endDayofWeek = this.daysMap[bookingDates.endDate.getUTCDay()];
      const validResourceSchedule = resource.schedules.find((schedule) => {
        return (
          schedule.dayOfWeek === startDayOfWeek &&
          schedule.dayOfWeek === endDayofWeek &&
          schedule.startTime >= bookingDates.startDate &&
          schedule.endTime <= bookingDates.endDate
        );
      });

      if (!validResourceSchedule) {
        throw new ConflictException(
          'The requested booking time falls outside of the resource available operating schedule.',
        );
      }

      // i am going to check if the booking starttime and endTime is not in the range of already Booked resource
      const isResourceBooked = resource.bookings.find((booking) => {
        return (
          bookingDates.startDate < booking.endTime &&
          bookingDates.endDate > booking.startTime
        );
      });

      if (isResourceBooked) {
        throw new ConflictException(
          'This resource is already booked for the selected time slot. Please choose a different time.',
        );
      }

      const newlyCreatedBooking = await this.prisma.booking.create({
        data: {
          ...bookingDetails,
          resourceId: resource.id,
          userId: userId,
        },
      });

      return {
        success: true,
        message: 'Booking Created Successfully',
        booking: newlyCreatedBooking,
      };
    } catch (error) {
      throw error;
    }
  }
  // PATCH /booking/:id
  async updateBooking(
    bookingId: string,
    userId: string,
    updateDetails: UpdateBookingDto,
    resource: ResourceWithRelations,
  ) {
    try {
      // 1. Find the existing booking in the resource's loaded bookings
      const existingBooking = resource.bookings.find((b) => b.id === bookingId);
      if (!existingBooking) {
        throw new NotFoundException('Booking not found.');
      }

      if(existingBooking.userId !== userId){
        throw new UnauthorizedException('You are unauthorized to update this booking.');
      }

      // 2. Handle partial updates: falling back to existing values if not provided
      const startDate = updateDetails.startTime ? new Date(updateDetails.startTime) : existingBooking.startTime;
      const endDate = updateDetails.endTime ? new Date(updateDetails.endTime) : existingBooking.endTime;

    
      if (startDate >= endDate) {
        throw new BadRequestException('Booking start time must be strictly before the end time.');
      }

      
      if (startDate < new Date()) {
        throw new BadRequestException('Cannot update a booking to a time in the past.');
      }

      const startDayOfWeek = this.daysMap[startDate.getUTCDay()];
      const endDayofWeek = this.daysMap[endDate.getUTCDay()];

      const validResourceSchedule = resource.schedules.find((schedule) => {
        return (
          schedule.dayOfWeek === startDayOfWeek &&
          schedule.dayOfWeek === endDayofWeek &&
          startDate >= schedule.startTime &&
          endDate <= schedule.endTime
        );
      });

      if (!validResourceSchedule) {
        throw new ConflictException(
          'The requested booking time falls outside of the resource available operating schedule.',
        );
      }

      // 6. Overlap Check 
      const isResourceBooked = resource.bookings.find((booking) => {
        return (
          booking.id !== bookingId && 
          startDate < booking.endTime && 
          endDate > booking.startTime
        );
      });

      if (isResourceBooked) {
        throw new ConflictException(
          'This resource is already booked for the selected time slot. Please choose a different time.',
        );
      }

      
      const updatedBooking = await this.prisma.booking.update({
        where: { id: bookingId, userId: userId },
        data: {
          ...updateDetails,
          ...(updateDetails.startTime && { startTime: startDate }),
          ...(updateDetails.endTime && { endTime: endDate }),
        },
      });

      return {
        success: true,
        message: 'Booking Updated Successfully',
        booking: updatedBooking,
      };

    } catch (error) {
      throw error;
    }
  }


  //get /bookings/
  async getBookings(user: Omit<User, 'password'> ) {
    
     const bookings = await this.prisma.booking.findMany({
      where: user.role === Role.ADMIN ? {} : { userId: user.id }
      });

     return {
      success: true,
      message: "Bookings Retrieved Successfully",
      bookings: bookings
     }
      
  }

  //get /booking/:id
 async getBooking(bookingId: string, user: Omit<User, 'password'>) {
    const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {resource: true}
    });

    if (!booking) {
        throw new NotFoundException('Booking not found.');
    }

    
    if (user.role !== Role.ADMIN && booking.userId !== user.id) {
        throw new ForbiddenException('You do not have permission to view this booking.');
    }

    return {
        success: true,
        message: 'Booking Detail Retrieved Successfully',
        booking: booking
    };
}

  //PATCH /bookings/:id/status?status=''
 async changeBookingStatus(bookingId: string, statusChange: ChangeBookingStatusDto) {
  const { status } = statusChange;

 
  const existingBooking = await this.prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!existingBooking) {
    throw new NotFoundException('Booking not found.');
  }

  
  if (existingBooking.status === status) {
    throw new ConflictException(`Booking is already in ${status} status.`);
  }


  const updatedBooking = await this.prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  return {
    success: true,
    message: 'Booking Status Updated Successfully',
    booking: updatedBooking,
  };
}
  //delete /bookings/:id/cancel
 async cancelBooking(bookingId: string, userId: string, userRole: Role) {
  
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }

   
    if (userRole !== Role.ADMIN && booking.userId !== userId) {
      throw new ForbiddenException('You do not have permission to cancel this booking.');
    }

    
    if (booking.status === 'CANCELLED') {
      throw new ConflictException('This booking is already cancelled.');
    }

    
    const cancelledBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    return {
      success: true,
      message: 'Booking Cancelled Successfully',
      booking: cancelledBooking,
    };
  }
}
