import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from './dto/CreateResourceDto';
import { Prisma } from 'prisma/generated/prisma/client';
import { SchedulesService } from 'src/schedules/schedules.service';

@Injectable()
export class ResourcesService {

        constructor(private prisma:PrismaService, private readonly schedulesService:SchedulesService){}


        async createResource(resourceDetails: CreateResourceDto){
             
                try {
                    const {schedules, ...resourceInfo} = resourceDetails
                     {/*[
    {
      "dayofWeek": "MONDAY",
      "startTime": "2026-10-05T09:00:00Z",
      "endTime": "2026-10-05T17:00:00Z"
    }
  ]*/}
               
                 const existingResource = await this.prisma.resource.findFirst({
                where:{
                    name: resourceInfo.name,
                    description: resourceInfo.description,
                    isActive: true  
                }
                 })

                 if(existingResource){
                   throw new ConflictException('A resource with this exact name and description already exists')
                 }


                 let scheduleDetails: {id: string}[] = []

                 if(schedules && schedules.length > 0){
                    const createdSchedules = await this.schedulesService.createSchedule(schedules)
                 }
   
                 
                


                   

                        
                } catch (error) {
                    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                         throw new ConflictException('')
                    }

                    throw error
                }



        }
        async getResources(){}
        async getResource(){}
        async updateResource(){}
        async deactivateResource(){}
       


}
