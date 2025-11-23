// import { Module } from '@nestjs/common';
// import { AuthService, EmailEventService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { userModel } from 'src/DB/model/User.Model';
// import { OtpModel } from 'src/DB/model/OtP.Model';
// import { JwtService } from '@nestjs/jwt';
// import { GoogleAuthService } from 'src/common/utils/GoogleAuthService';
// import { AuthGuard } from 'src/common/guards/auth.guards';

// @Module({
//   imports:[userModel,OtpModel ],
//   controllers: [AuthController],
//   providers: [AuthService,JwtService,GoogleAuthService,EmailEventService ,AuthGuard],
//   exports:[AuthGuard]
// })
// export class AuthModule {}
import { Module } from '@nestjs/common';
import { AuthService, EmailEventService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/DB/model/User.Model';
import { Otp, otpSchema } from 'src/DB/model/OtP.Model';
import { GoogleAuthService } from 'src/common/utils/GoogleAuthService';
import { AuthGuard } from 'src/common/guards/auth.guards';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: otpSchema },
    ]),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    GoogleAuthService,
    EmailEventService,
    AuthGuard,
  ],

  exports: [
    AuthGuard,
    JwtModule,   
    MongooseModule, 
  ],
})
export class AuthModule {}
