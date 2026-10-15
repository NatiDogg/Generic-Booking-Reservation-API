import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ResourceExistPipe implements PipeTransform{
     
      constructor(private prisma:PrismaService){}
    async transform(value: any, metadata: ArgumentMetadata) {
         
          const resource = await this.prisma.resource.findUnique({where: {id: value}, include: {bookings: true, schedules: true}})

         if (!resource || !resource.isActive) {
           throw new NotFoundException("Resource not found or is currently inactive");
         }
          return resource

    }
}