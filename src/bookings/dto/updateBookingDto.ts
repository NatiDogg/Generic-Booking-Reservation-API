import { PartialType } from "@nestjs/mapped-types";
import { CreateBookingDto } from "./createBookingDto";

export class UpdateBookingDto extends PartialType(CreateBookingDto){}