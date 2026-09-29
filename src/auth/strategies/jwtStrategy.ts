import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy,ExtractJwt} from 'passport-jwt'
import { User } from "prisma/generated/prisma/client";
import { Role } from "prisma/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { envConfig } from "src/utils/zodEnvValidator";

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy){

       constructor(private configService:ConfigService<envConfig>, private prisma:PrismaService){
             super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_TOKEN'),
                ignoreExpiration: false
             })

       }
        
      async validate(payload: {id: string, name: string, email: string, role:Role}): Promise<Omit<User,'password'> | undefined> {
           const user = await this.prisma.user.findUnique({where: {id: payload.id}, omit:{password: true}})

            if(!user){
                throw new UnauthorizedException("User Not Found!")
            }
            return user
      }
}