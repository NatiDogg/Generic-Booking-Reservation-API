import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from './dto/createScheduleDto';

@Injectable()
export class SchedulesService {

       constructor(private prisma:PrismaService){}


       async createSchedule(scheduleDetails: CreateScheduleDto[]){

       }


}
