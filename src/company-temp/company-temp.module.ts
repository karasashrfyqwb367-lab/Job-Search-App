import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyTempService } from './company-temp.service';
import { CompanyTempController } from './company-temp.controller';
import { Company, CompanySchema } from 'src/DB/model/Company';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { userModel, UserSchema } from 'src/DB/model/User.Model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: 'User', schema: UserSchema } 
    ]),JwtModule
  ],
  providers: [CompanyTempService, AuthGuard],
  controllers: [CompanyTempController],
  exports: [CompanyTempService],
})
export class CompanyTempModule {}
