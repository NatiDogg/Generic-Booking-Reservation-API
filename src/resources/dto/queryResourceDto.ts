import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class QueryResourceDto{
     
     @IsOptional()
     @IsString({message: 'Search must be a string'})
     @MaxLength(20, {message: 'Resource name must not exceed 20 characters'})
      name?: string

     @IsOptional()
     @IsString({message: 'Location must be a string'})
     @MaxLength(20, {message: 'Location must not exceed 20 characters'})
     location?: string

     @IsOptional()
     @Type(()=> Number)
     @IsInt({message: 'minPrice must be a Number'})
     @Min(0, {message:'minPrice cannot be negative'})
     minPrice?: number

     @IsOptional()
     @Type(()=> Number)
     @IsInt({message: 'maxPrice must be a Number'})
     @Min(0, {message:'maxPrice cannot be negative'})
     maxPrice?: number

     @IsOptional()
     @Type(()=> Date)
     @IsDate({ message: 'Start time must be a valid ISO Date' })
     date?: Date






     
}