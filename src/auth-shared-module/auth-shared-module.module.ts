import { Module } from '@nestjs/common';
import {PassportModule} from '@nestjs/passport'
import { JwtService } from 'src/utils/jwtService';
import { BcryptService } from 'src/utils/bcryptService';
@Module({
   imports: [PassportModule.register({defaultStrategy: 'jwt'})],
   providers: [JwtService,BcryptService],
   exports: [BcryptService,JwtService,PassportModule]
})
export class AuthCommonModule {}
