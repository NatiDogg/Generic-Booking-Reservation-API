import { Injectable } from "@nestjs/common";
import { Role } from "prisma/generated/prisma/enums";
import jwt from 'jsonwebtoken'
import { envConfig } from "./zodEnvValidator";
import { ConfigService } from "@nestjs/config";
@Injectable()

export class JwtService{

        constructor(private readonly configService:ConfigService<envConfig>){}

      createAccessToken(userPayload: {id: string, name: string, email: string, role:Role}){
          return jwt.sign(userPayload)
      }

      createRefreshToken(){

      }
      verifyAccessToken(){

      }

      verifyRefreshToken(){

      }


}