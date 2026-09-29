import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthCommonModule } from 'src/auth-shared-module/auth-shared-module.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UserModule, AuthCommonModule]
})
export class AuthModule {}
