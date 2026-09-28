import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {


         constructor(private prisma:PrismaService){}


         async createUser(){

         }

         async getusers(){

         }

         async getUser(){
            
         }

         async deleteUser(){

         }
}
