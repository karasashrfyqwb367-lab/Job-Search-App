import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from 'src/DB/model/OtP.Model';

@Injectable()
export class OtpCronService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
  ) {}

  // CRON Job — runs every 6 hours
  @Cron('0 */6 * * *')
  async deleteExpiredOtps() {
    const now = new Date();

    const result = await this.otpModel.deleteMany({
      expireAT: { $lt: now },
    });

    console.log(
      ` CRON JOB: Deleted ${result.deletedCount} expired OTP codes at ${now.toISOString()}`
    );
  }
}
