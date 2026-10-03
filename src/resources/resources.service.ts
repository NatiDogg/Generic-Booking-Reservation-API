import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
                const existingResource = await this.prisma.resource.findFirst({
                  where: {
                    name: resourceInfo.name,
                    description: resourceInfo.description,
                    isActive: true
                  }
                })

                if(existingResource){
                   throw new ConflictException('A resource with this exact name and description already exists');
                }

                const newlyCreatedResource = await this.prisma.$transaction(async(tx)=>{
                   const createdResource = await tx.resource.create({
                    data: {
                       ...resourceInfo
                    }
                   })

                   if(schedules && schedules.length > 0){
                      await this.schedulesService.createSchedule(createdResource.id, schedules, tx)
                   }

                   return tx.resource.findUnique({
                    where: {
                      id: createdResource.id
                    },
                    include: {schedules: true}
                   })
                })
                if (!newlyCreatedResource) {
                 throw new NotFoundException('Failed to retrieve newly created resource');
                 }

                return {
                   success: true,
                   message: `Resource '${newlyCreatedResource.name}' has been created successfully`,
                   resource: newlyCreatedResource,
                }
                
             } catch (error) {
                if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                  throw new ConflictException('A resource with this unique field already exists.');
                }
                throw error
             }
              



        }
        async getResources(){}
        async getResource(){}
        async updateResource(){}
        async deactivateResource(){}
       


}
