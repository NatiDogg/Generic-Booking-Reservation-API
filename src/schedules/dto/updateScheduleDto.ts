import { PartialType } from "@nestjs/mapped-types";
import { CreateScheduleDto } from "./createScheduleDto";


export class UpdateScheduleDto extends PartialType(CreateScheduleDto){}