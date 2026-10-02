import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from './dto/CreateResourceDto';
import { Prisma } from 'prisma/generated/prisma/client';

@Injectable()
export class ResourcesService {

        constructor(private prisma:PrismaService){}


        async createResource(resourceDetails: CreateResourceDto){
             
                try {
                    
                        
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
