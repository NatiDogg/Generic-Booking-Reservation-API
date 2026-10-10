import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from './dto/createScheduleDto';
import { Prisma as PrismaTransaction  } from 'prisma/generated/prisma/browser';
import { UpdateScheduleDto } from './dto/updateScheduleDto';
import { Prisma } from 'prisma/generated/prisma/client';


@Injectable()
export class SchedulesService {

       constructor(private prisma:PrismaService){}


       async createSchedule(resourceId: string,scheduleDetails: CreateScheduleDto[] | CreateScheduleDto, tx?:PrismaTransaction.TransactionClient){
           const client = tx || this.prisma

           const detailsArray = Array.isArray(scheduleDetails) ? scheduleDetails : [scheduleDetails];
           const schedulesWithResourceId = detailsArray.map((schedule) => ({ ...schedule, resourceId }));

           const newlyCreatedSchedule = await client.schedule.createManyAndReturn({
              data: schedulesWithResourceId,
              skipDuplicates: true
           })

            return {
                 success: true,
                 message: "Schedule Created Successfully",
                 schedule: newlyCreatedSchedule
            }

       }

       async updateSchedule( scheduleId: string ,updateDetails:UpdateScheduleDto){
             
            try {
               const updatedSchedule = await this.prisma.schedule.update({
                     where: {
                           id: scheduleId

                     },
                     data:{
                         ...updateDetails
                     }
               })
               return {
                  success: true,
                  message: "Schedule updated successfully",
                  schedule: updatedSchedule,
               };
            } catch (error) {
               if(error instanceof Prisma.PrismaClientKnownRequestError && error.code ==='P2025' ){
                    throw new NotFoundException("Schedule not found")
               }
               throw error
            }

             
       }

       async getSchedule(scheduleId: string){
            try {

               const schedule = await this.prisma.schedule.findUnique({
                    where: {id: scheduleId}
               })

               if(!schedule){
                    throw new NotFoundException("Schedule Not Found")
               }

               return {
                     success: true,
                     message: 'Schedule retrieved Successfully',
                     schedule: schedule
               }
               
            } catch (error) {
                
               throw error
            }
       }

       async getSchedulesByResource(resourceId: string){
               const schedules = await this.prisma.schedule.findMany({
                    where:{
                          resourceId
                    }
               })

               return {
                     success: true,
                     message: 'Schedules retrieved Successfully',
                     schedules: schedules
               }
       }


}
