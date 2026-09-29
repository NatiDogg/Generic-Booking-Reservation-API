import { Module } from '@nestjs/common';
import {PassportModule} from '@nestjs/passport'
import { JwtService } from 'src/utils/jwtService';
import { BcryptService } from 'src/utils/bcryptService';
import { RolesGuard } from 'src/auth/guards/rolesGuard';
import { jwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
@Module({
   imports: [PassportModule.register({defaultStrategy: 'jwt'})],
   providers: [JwtService,BcryptService,RolesGuard,jwtAuthGuard],
   exports: [BcryptService,JwtService,PassportModule,RolesGuard,jwtAuthGuard]
})
export class AuthCommonModule {}
