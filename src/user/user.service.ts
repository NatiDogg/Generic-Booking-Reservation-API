import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'prisma/generated/prisma/client';
import { RegisterDto } from 'src/auth/dto/registerDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {


         constructor(private prisma:PrismaService){}


         async createUser(userDetails:RegisterDto){
             try {
                return await this.prisma.user.create({data:{
                    ...userDetails
                }, include: {Bookings: true}, omit: {password: true}})
                
             } catch (error) {
                if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                    throw new ConflictException('Email already in use')
                }
                throw error
             }
         }
         async findUserByEmail(email: string){
            return await this.prisma.user.findUnique({where: {email}})
         }

         async findUserById(id: string){
            return await this.prisma.user.findUnique({where: {id}, omit: {password: true}})
         }

         async getusers(){
             const users = await this.prisma.user.findMany({omit: {password:true}})
           return {
            success: true,
            message: 'Users Retrieved Successfully',
            users: users
           }
         }

         async getUser(id: string){
            const user = await this.prisma.user.findUnique({where:{id}})

            if(!user){
                throw new NotFoundException("User Not Found")
            }
            return {
                success: true,
                message: "User Retrieved Successfully",
                user: user
            }
         }

         async deleteUser(id: string){
             const user = await this.prisma.user.delete({where: {
                 id
             }})
             return {
                success: true,
                message: 'User Deleted Successfully'
             }
         }
}
