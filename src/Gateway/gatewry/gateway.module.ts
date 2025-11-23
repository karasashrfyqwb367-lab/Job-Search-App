// gateway.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { RealtimeGateway } from './gateway';
import { ChatModule } from 'src/chat/chat.module';
import { User, UserSchema } from 'src/DB/model/User.Model';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ChatModule, 
  ],
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class GatewryModule {}
