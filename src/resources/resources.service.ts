import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResourcesService {

        constructor(private prisma:PrismaService){}


        async createResource(){}
        async getResources(){}
        async getResource(){}
        async updateResource(){}
        async deactivateResource(){}
       


}
