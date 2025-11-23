import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { join, resolve } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CompanyTempModule } from './company-temp/company-temp.module';
import { JobModule } from './job/job.module';
import { GatewryModule } from './Gateway/gatewry/gateway.module';
import { ChatModule } from './chat/chat.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env.dev'),
      isGlobal: true,
    }),

    
    // MongoDB
    MongooseModule.forRoot(process.env.DB_URL as string, {
      serverSelectionTimeoutMS: 5000,
      onConnectionCreate(connection) {
        connection.on('connected', () => {
          console.log('MongoDB Connected Successfully');
        });
      },
    }),

    ScheduleModule.forRoot(),

    // Modules
    AuthModule,
      UserModule,

    CompanyTempModule,
GatewryModule,
    JobModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

   
  ],
})
export class AppModule {}

