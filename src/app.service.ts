import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envConfig } from './utils/zodEnvValidator';

@Injectable()
export class AppService {
     
  getHello(): string {
    
    return 'Server Connected Successfully';
  }
}
