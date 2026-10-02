import { Type } from "class-transformer";
import {  ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";
import { DayOfWeek } from "prisma/generated/prisma/enums";




export class CreateResourceDto{

      @IsNotEmpty({message: 'Resource name is Required'})
      @IsString({message: 'Resource name must be a String'})
      @MinLength(4, {message: 'Resource name must be atleast 4 characters long'})
      @MaxLength(20, {message: 'Resource name must not exceed 20 characters'})
      name!: string

      @IsNotEmpty({message: 'Description is Required'})
      @IsString({message: 'Description must be a String'})
      @MinLength(6, {message: 'Description must be atleast 6 characters long'})
      @MaxLength(150, {message: 'Description must not exceed 150 characters'})
      description!: string

      @IsNotEmpty({message: 'Location is Required'})
      @IsString({message: 'Location must be a String'})
      @MinLength(3, {message: 'Location must be atleast 3 characters long'})
      @MaxLength(20, {message: 'Location must not exceed 20 characters'})
      location!: string

      @Type(()=> Number)
      @IsNotEmpty({message: 'Price is Required'})
      @IsInt({message: 'Price must be a Number'})
      @Min(0, {message: 'Price cannot be Negative'})
      price!: number

      


}