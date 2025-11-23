import { ConflictException, Injectable, NotFoundException ,UnauthorizedException ,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/DB/model/User.Model';
import { ConfirmEmail, GoogleLoginDto, Login, ResendOTP, SignupDTO } from './dto/user.dto';
import { Otp, otpDoucment } from 'src/DB/model/OtP.Model';
import { gneerteOtP } from "../common/utils/otp"
import { OTPEnum, providerEnum, RoleEnum } from 'src/common/enum/enum';
import { compare, hash } from 'src/common/utils/security/hash';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { GoogleAuthService } from 'src/common/utils/GoogleAuthService';
import { emailEvent } from 'src/common/utils/event/Email.event';
import { EventEmitter } from 'events';
export class EmailEventService extends EventEmitter {}

export class AuthService {
 constructor(
  @InjectModel(User.name) private readonly userModel:Model<UserDocument>,
  @InjectModel(Otp.name) private readonly OtPModel:Model<otpDoucment>,
   private JwtService: JwtService,
   private googleAuthService: GoogleAuthService,
     private readonly emailEvent: EmailEventService, 
 ){}
   

  async generateUserTokens(user: UserDocument) {
    
    const jwtId = randomUUID();

    
    const accessToken = await this.JwtService.signAsync(
      { id: user._id, email: user.email ,role: user.role },
      {
        secret: process.env.ACCESS_SECRET_KEY,
        expiresIn: Number(process.env.ACCESS_EXPIES_IN),
        jwtid: jwtId, 
      }
    );

    const refreshToken = await this.JwtService.signAsync(
      { id: user._id, email: user.email ,role: user.role},
      {
        secret: process.env.REFFERSH_SECRET_KEY,
        expiresIn: Number(process.env.REFFERSH_EXPIES_IN),
        jwtid: jwtId, // نفس jwtId
      }
    );

    return { accessToken, refreshToken };
  }


private async createdOtP(userId:Types.ObjectId){
    await this.OtPModel.create([{
      createdBy:userId,
      code: gneerteOtP(),
      expireAT:new Date(Date.now()+2*60*1000) , //2min from now
      type:OTPEnum.CONFIRM_EMAIL
    }])
}




async signup(signupDTO: SignupDTO) {

  const { username, email, password, dob,mobileNumber,role } = signupDTO;

  const checkUser = await this.userModel.findOne({ email });
  if (checkUser) {
    throw new ConflictException("User Already Exists");
  }


  const user = await this.userModel.create({
    username,
    email,
    password,
    dob,
    mobileNumber,
     role: role || RoleEnum.USER
    
  });

  await this.createdOtP(user._id)

    
  return {
    message: "User created successfully",
    user,
  };
}






  async resendOTP(resendOTP: ResendOTP) {

  const {email}= resendOTP;

  const user = await this.userModel.findOne({
    email,
    confirmemail: { $exists:false } //ان الحقل مش موجود قيمته اصلا
      // confirmemail: false//معناها ان الحقل موجود وقيمتة falas
  }).populate([{ path: "OTP", match: { type:  OTPEnum.CONFIRM_EMAIL } }]);


  if (!user) {
    throw new NotFoundException("user Not Found");
  }

  if (user.OTP?.length) {
    throw new ConflictException("Otp Already Exist");
  }
  
  await this.createdOtP(user._id);

  return { message: "Send Successfully OTP" };
}


//   async confinEmail(confinEmail:ConfirmEmail) {
//     const {email,otp}=confinEmail

//     const user = await this.userModel.findOne({
//       email,
//       confirmemail:{$exists:false}
//     }).populate([{path:"OTP",match:{type:OTPEnum.CONFIRM_EMAIL}}])
// if (!user) {
//   throw new NotFoundException("user Not Fonund")
// }

// if (!user.OTP?.length) {
//     throw new ConflictException("Otp Not Exist");
//   }
// if (! await compare({plaintext:otp,hash:user.OTP[0].code}) ) {
//   throw new NotFoundException("In vaild OTp")
// }


// await this.userModel.updateOne({
//   _id:user._id

// },{
//   $set:{confirmemail:new Date() ,$inc:{_v:1}}
// })

//   return { message: "Confirm Email Successfully" };
// }
async confirmEmail(confirmEmailDto: ConfirmEmail) {
  const { email, otp } = confirmEmailDto;

  const user = await this.userModel.findOne({
    email
  })
    .populate({
      path: "OTP",
      match: { type: OTPEnum.CONFIRM_EMAIL },
      options: { sort: { createdAt: -1 } }
    })
    .lean<{ _id: string, OTP: { code: string; type: string; expireAT: Date }[] }>();

  if (!user) throw new NotFoundException("User Not Found");

  if (!user.OTP?.length) throw new ConflictException("OTP Not Exist");

  // مقارنة OTP
  const validOTP = await compare({
    plaintext: otp,
    hash: user.OTP[0].code,
  });

  if (!validOTP) {
    throw new NotFoundException("Invalid OTP");
  }

  // تحديث تأكيد الإيميل
  await this.userModel.updateOne(
    { _id: user._id },
    {
      $set: {
        isConfirmedEmail: true,
        confirmEmailAt: new Date(),
      },
      $inc: { __v: 1 }
    }
  );

  return { message: "Confirm Email Successfully" };
}


  async login(loginDto:Login) {
    const {email,password}=loginDto

    const user =await this.userModel.findOne({
      email,
    //  isConfirmedEmail:{$exists:true},//error
     provider:providerEnum.SYSTEM
    })
    
    
    if (!user) {
      throw new NotFoundException("user Not found")}
      if (!(await compare({plaintext:password,hash:user.password}))) {
        throw new  ConflictException("Invaild Email or Password")
      }
      
  
  const tokens = await this.generateUserTokens(user);

  return { message: "Confirm Email Successfully" ,credential:{tokens}};
}

/******************************signup with google ***************************** */


// src/auth/auth.service.ts

  async signupOrLoginWithGoogle(dto: GoogleLoginDto) {
    const googleUser = await this.googleAuthService.verifyGoogleToken(dto.idToken);

  const email = googleUser!.email!;
const name = googleUser!.name ?? null;
const picture = googleUser!.picture ?? null;

    let user = await this.userModel.findOne({ email });

    if (!user) {
      // إنشاء مستخدم جديد
      user = await this.userModel.create({
        email,
        username: name,
        profilePic: picture,
        provider: 'google',
      });
    } else if (user.provider !== 'google') {
      throw new ConflictException('Email already exists with another provider');
    }

    // توليد التوكن
    const tokens = this.generateUserTokens(user);
    return { message: 'Signup/Login with Google successful', user, tokens };
  }

  

// Send OTP
 async forgetPassword(email: string) {
  const user = await this.userModel.findOne({
    email,
    deletedAt: { $exists: false }
  });

  if (!user) throw new NotFoundException('Invalid account');

  const newOtp = await this.OtPModel.create({
  code: '123456',
  createdBy: user._id,
  type: OTPEnum.FORGET_PASSWORD,
  expireAT: new Date(Date.now() + 5 * 60 * 1000), // 5 دقائق صلاحيته
});


  this.emailEvent.emit('ResetPassword', {
    to: email,
    subject: 'Forgot Password',
    title: 'Reset Password',
    otp: newOtp,
  });

  return { message: 'OTP sent successfully' };
}

/********************************************** */

  //  Verify OTP
  async verifyForgetPassword(email: string, otp: string) {
    const user = 
 await this.userModel.findOne({ email, 
      // isConfirmedEmail: true,
       deletedAt: { $exists: false } });

    if (!user) throw new NotFoundException('Invalid account');

    const otpRecord = await this.OtPModel.findOne({
      createdBy: user._id,
      type: OTPEnum.FORGET_PASSWORD,
      expireAT: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) throw new BadRequestException('OTP expired or invalid type');

    const isValid = await compare({ plaintext: otp, hash: otpRecord.code }); //بقارين اوتيبي اللي مبعوت  بي  اوتبي الي انا خزنيته  
    if (!isValid) throw new BadRequestException('Invalid OTP');

    return { message: 'OTP verified successfully' };
  }

  //Reset Password

  async resetForgetPassword(email: string, otp: string, password: string) {
    const user = await this.userModel.findOne({ email, 
      // isConfirmedEmail: true, 
      deletedAt: { $exists: false } });

    if (!user) throw new NotFoundException('Invalid account');

    const otpRecord = await this.OtPModel.findOne({
      createdBy: user._id,
      type: OTPEnum.FORGET_PASSWORD,
      expireAT: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) throw new BadRequestException('OTP expired or invalid type');

    const isValid = await compare({ plaintext: otp, hash: otpRecord.code });
    if (!isValid) throw new BadRequestException('Invalid OTP');

    await this.userModel.updateOne({ email }, { password: await hash({ plaintext: password }) ,
    changeCredentialTime: new Date() 
  });

   
    await this.OtPModel.deleteOne({ _id: otpRecord._id });

    // token
  const tokens = await this.generateUserTokens(user);
    return { message: 'Password reset successfully' ,  credential:{tokens} };
  }



}
















 
