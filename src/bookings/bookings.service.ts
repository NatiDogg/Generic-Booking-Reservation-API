import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/createBookingDto';
import {  Prisma, DayOfWeek } from 'prisma/generated/prisma/client';
import { UpdateBookingDto } from './dto/updateBookingDto';

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
  //patch /booking/:id
  async updateBooking(bookingId: string, userId: string, updateDetails: UpdateBookingDto) {
   
         

  }
  //get /booking/
  async getBookings() {}

  //get /booking/:id
  async getBooking() {}

  //patch /booking/:id/status
  async changeBookingStatus() {}

  //delete /booking/:id
  async deleteBooking() {}
}
