import { 
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  IsDateString,
  Validate,
  Matches,
  IsNotEmpty,
  IsNumber,
  isNumberString,
  IsNumberString,
  Length
} from "class-validator";
import { Type } from "class-transformer";
import { GenderEnum, providerEnum, RoleEnum } from "src/common/enum/enum";
//import { IsAdult } from "../decorators/isAdult.decorator"; // Custom age validator

export class SignupDTO {
  

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  username:string

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(providerEnum)
  @IsOptional()
  provider?: providerEnum = providerEnum.SYSTEM;

  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsDateString()
  @IsNotEmpty()
  @IsDateString()
  dob: string;   // 2023-12-04
 

  @IsString()
  @Matches(/^[0-9]{11}$/)  // 11 digits
  mobileNumber: string;


 @IsOptional()
profilePic?: string;

@IsOptional()
coverPic?: string;

@IsEnum(RoleEnum)
@IsOptional()
role?: RoleEnum = RoleEnum.USER;

}


export class ResendOTP{

  @IsEmail()
  email:string

}



export class ConfirmEmail {
  @IsEmail()
  email: string;

  @IsNotEmpty()
@IsNumberString()
  otp: string; // يقبل "123456"
}

export class Login {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class GoogleLoginDto {
  idToken: string;
}




export class ForgetPasswordDTO {
  @IsEmail()
  email: string;
}



export class VerifyForgetPasswordDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}



export class ResetForgetPasswordDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  otp: string;

  @IsString()
  @MinLength(6)
  password: string;
}


