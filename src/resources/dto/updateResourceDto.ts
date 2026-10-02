import {PartialType} from '@nestjs/mapped-types'
import { CreateResourceDto } from './CreateResourceDto';

export class UpdateResourceDto extends PartialType(CreateResourceDto){}

