import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { jwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { RolesGuard } from 'src/auth/guards/rolesGuard';
import { Roles } from 'src/auth/decorators/rolesDecorator';
import { Role } from 'prisma/generated/prisma/enums';
import { CreateScheduleDto } from './dto/createScheduleDto';
import { UpdateScheduleDto } from './dto/updateScheduleDto';

@Controller('schedules')
export class SchedulesController {


        constructor(private readonly schedulesService:SchedulesService){}


        @Roles(Role.ADMIN)
        @UseGuards(jwtAuthGuard, RolesGuard)
        @Post(':resourceId')
        async createSchedule(@Param('resourceId', ParseUUIDPipe) resourceId: string,@Body() scheduleDetails: CreateScheduleDto){
            return await this.schedulesService.createSchedule(resourceId,scheduleDetails)
        }

        
        @UseGuards(jwtAuthGuard)
        @Get(':id')
        async getSchedule(@Param('id', ParseUUIDPipe) id: string){
           return await this.schedulesService.getSchedule(id)
        }

        @UseGuards(jwtAuthGuard)
        @Get('resource/:resourceId')
        async getSchedulesByResource(@Param('resourceId',ParseUUIDPipe) resourceId: string){
            return await this.schedulesService.getSchedulesByResource(resourceId)
        }

        @Roles(Role.ADMIN)
        @UseGuards(jwtAuthGuard, RolesGuard)
        @Patch(':id')
        async updateSchedule(@Param('id',ParseUUIDPipe) id: string, @Body() updateDetails:UpdateScheduleDto){
            return await this.schedulesService.updateSchedule(id, updateDetails)
        }

        @Roles(Role.ADMIN)
        @UseGuards(jwtAuthGuard, RolesGuard)
        @Delete(':id')
        async deleteSchedule(@Param('id',ParseUUIDPipe) id: string){
            return await this.schedulesService.deleteSchedule(id)
        }
}
