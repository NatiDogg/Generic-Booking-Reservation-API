import { Injectable } from "@nestjs/common";
import { Role } from "prisma/generated/prisma/enums";
import jwt from 'jsonwebtoken'
import { envConfig } from "./zodEnvValidator";
import { ConfigService } from "@nestjs/config";
@Injectable()

export class JwtService{

        constructor(private readonly configService:ConfigService<envConfig>){}

      createAccessToken(userPayload: {id: string, name: string, email: string, role:Role}){
          return jwt.sign(userPayload, this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN'),{expiresIn: '20m'})
      }

      createRefreshToken(userPayload: {id: string, name: string, email: string, role:Role}){
         return jwt.sign(userPayload, this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN'),{expiresIn: '20m'})
      }
      verifyAccessToken(token: string){
         return jwt.verify(token, this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN')) as {
               id: string,
               name: string,
               email: string,
               role: Role
         }
      }

      verifyRefreshToken(token: string){
          return jwt.verify(token, this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN')) as {
               id: string,
               name: string,
               email: string,
               role: Role
         }
      }


}