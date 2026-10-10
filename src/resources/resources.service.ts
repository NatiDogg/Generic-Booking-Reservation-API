import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from './dto/CreateResourceDto';
import { Prisma } from 'prisma/generated/prisma/client';
import { SchedulesService } from 'src/schedules/schedules.service';
import { QueryResourceDto } from './dto/queryResourceDto';
import { UpdateResourceDto } from './dto/updateResourceDto';

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
        async getResources(query: QueryResourceDto){
            const {name,location,minPrice,maxPrice,date} = query

            const queryCondition = {
                  ...(name && {
                     name: {contains: name, mode: 'insensitive' as const }
                  }),
                  ...(location && {
                      location: {contains: location, mode: 'insensitive' as const}
                  }),
                  ...((minPrice !== undefined || maxPrice !== undefined) && {
                     price: {
                         ...(minPrice !== undefined && {gte: minPrice}),
                         ...(maxPrice !== undefined && {lte: maxPrice})
                     }
                  }),
                  ...(date && {
                      schedules: {some: {startTime: {lte: new Date(new Date(date).setHours(23, 59, 59, 999))}, endTime: {gte: new Date(new Date(date).setHours(0, 0, 0, 0))}}}
                  })
                  
            }


            const resources = await this.prisma.resource.findMany({
                where: queryCondition,
                include:{schedules: true}
            } )

            return  {
                success: true,
                message: 'Resources retrieved successfully',
                resources: resources
            }
        }
        async getResource(resourceId: string){
             const resource = await this.prisma.resource.findUnique({
                where:{
                   id: resourceId,
                   isActive: true
                },
                include:{
                    schedules: true
                }
             })

             if(!resource){
               throw new NotFoundException('Resource not Found')
             }

             return {
                 success: true,
                 message: 'Resource Retrieved Successfully',
                 resource: resource
             }
        }
        async updateResource(resourceId: string,resourceDetails:UpdateResourceDto){
              const {schedules, ...resourceInfo} = resourceDetails
            try {
                
               const updatedResource = await this.prisma.resource.update({
                   where:{
                      id: resourceId
                   },
                   data:{
                      ...resourceInfo
                   },
                   include:{schedules: true}
               })

               return {
                  success: true,
                  message: 'Resource Updated Successfully',
                  resource: updatedResource
               }
               
            } catch (error) {
               if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'){
                  throw new NotFoundException("Resource not Found")
               }

               throw error
            }


        }
        async deactivateResource(resourceId: string){
               
             try {
               const deactivatedResource = await this.prisma.$transaction(async(tx)=>{
                     const resource = await tx.resource.update({
                        where: {id: resourceId, isActive: true},
                        data: {isActive: false}
                     })

                  await tx.booking.updateMany({
                      where:{resourceId: resource.id, startTime: {gte: new Date()}},
                      data: {status: 'CANCELLED'}
                  })

                  return resource
               })

               return {
                  success: true,
                  message: "Resource deactivated successfully",
                  resource: deactivatedResource
               }


                 
             } catch (error) {
                if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'){
                  throw new NotFoundException("Resource not Found")
               }

               throw error
             }
        }
       


}
