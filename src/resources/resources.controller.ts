import { Controller,Get,Post,Patch,Delete,Body, Param, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { Roles } from 'src/auth/decorators/rolesDecorator';
import { Role } from 'prisma/generated/prisma/enums';
import { jwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { RolesGuard } from 'src/auth/guards/rolesGuard';
import { CreateResourceDto } from './dto/CreateResourceDto';
import { QueryResourceDto } from './dto/queryResourceDto';
import { UpdateResourceDto } from './dto/updateResourceDto';

@Controller('resources')
export class ResourcesController {
    
        constructor(private readonly resourceService:ResourcesService){}

    
       @Roles(Role.ADMIN)
       @UseGuards(jwtAuthGuard, RolesGuard)
       @Post('')
       async createResource(@Body() resourceDetails: CreateResourceDto){
            return await this.resourceService.createResource(resourceDetails)
       }

       

       @UseGuards(jwtAuthGuard)
       @Get('')
       async getResources(@Query() queryDetails:QueryResourceDto){
            return await this.resourceService.getResources(queryDetails)
       }

       @UseGuards(jwtAuthGuard)
       @Get(':id')
       async getResource(@Param('id', ParseUUIDPipe) id: string){
         return await this.resourceService.getResource(id)
       }

       @Roles(Role.ADMIN)
       @UseGuards(jwtAuthGuard, RolesGuard)
       @Patch(":id")
       async updateResource(@Param('id', ParseUUIDPipe) id: string, @Body() updateDetails: UpdateResourceDto){
           return await this.resourceService.updateResource(id, updateDetails)
       }

       @Roles(Role.ADMIN)
       @UseGuards(jwtAuthGuard, RolesGuard)
       @Delete(':id')
       async deactivateResource(@Param('id', ParseUUIDPipe) id: string){
          return await this.resourceService.deactivateResource(id)

       }





}
