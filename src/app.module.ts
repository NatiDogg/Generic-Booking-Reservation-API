import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from '@nestjs/config'
import {validate} from './utils/zodEnvValidator'
import { AuthModule } from './auth/auth.module';
import { AuthCommonModule } from './auth-shared-module/auth-shared-module.module';
import { UserModule } from './user/user.module';
import {ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, validate})
    ,PrismaModule, AuthModule, AuthCommonModule, UserModule,

    ThrottlerModule.forRoot({
        throttlers: [{ttl: 60000, limit: 20}]
    })
  ],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_GUARD,
      useClass: ThrottlerGuard

  }],
})
export class AppModule {}
