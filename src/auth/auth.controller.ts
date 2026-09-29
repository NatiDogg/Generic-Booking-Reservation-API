import { Body, Controller,Get,Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';
import { jwtAuthGuard } from './guards/jwtAuthGuard';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from './decorators/currentUserDecorator';
import { User } from 'prisma/generated/prisma/client';

@Controller('auth')
export class AuthController {

       constructor(private readonly authService:AuthService){}


       @Throttle({default: {limit: 5, ttl: 60000}})
       @Post('register')
       async registerUser(@Body() registerDetails:RegisterDto){
           return await this.authService.register(registerDetails)
       }

       @Throttle({default: {limit: 4, ttl: 60000}})
       @Post('login')
       async loginUser(@Body() loginDetails:LoginDto){
           return await this.authService.login(loginDetails)
       }

       @UseGuards(jwtAuthGuard)
       @Post('refresh')
       async refreshToken(@Body('refreshToken') refreshToken: string){
            return await this.authService.refreshToken(refreshToken)
       }
       @UseGuards(jwtAuthGuard)
       @Get('profile')
       async getProfile(@CurrentUser() user:Omit<User, 'password'>){
            return {user: user}
       }




}
