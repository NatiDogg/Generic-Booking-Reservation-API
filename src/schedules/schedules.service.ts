import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from './dto/createScheduleDto';
import { Prisma } from 'prisma/generated/prisma/browser';
import { UpdateScheduleDto } from './dto/updateScheduleDto';


@Injectable()
export class SchedulesService {

       constructor(private prisma:PrismaService){}


       async createSchedule(resourceId: string,scheduleDetails: CreateScheduleDto[] | CreateScheduleDto, tx?:Prisma.TransactionClient){
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

       async updateSchedule(){
             
             
       }


}
