import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';

@Injectable()
export class AuthService {
 
      constructor(private readonly userService:UserService) {}


      async register(registerDetails: RegisterDto){

      }

      async login(loginDetails:LoginDto){

      }
     
      async refreshToken(){

      }

      private generateTokenResponse(){
        
      }
}
