import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from './dto/createScheduleDto';
import { Prisma } from 'prisma/generated/prisma/browser';

@Injectable()
export class SchedulesService {

       constructor(private prisma:PrismaService){}


       async createSchedule(resourceId: string,scheduleDetails: CreateScheduleDto[], tx?:Prisma.TransactionClient){
           const client = tx || this.prisma
           const schedulesWithResourceId = scheduleDetails.map((schedule)=> ({...schedule, resourceId}))

           return await client.schedule.createMany({
              data: schedulesWithResourceId,
              skipDuplicates: true
           })

       }


}
