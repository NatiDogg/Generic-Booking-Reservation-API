import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from '@nestjs/config'
import {validate} from './utils/zodEnvValidator'
import { AuthModule } from './auth/auth.module';
import { AuthCommonModule } from './auth-shared-module/auth-shared-module.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, validate})
    ,PrismaModule, AuthModule, AuthCommonModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
