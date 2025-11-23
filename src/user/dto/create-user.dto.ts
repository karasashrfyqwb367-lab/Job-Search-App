import { 
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsEnum,
  IsNotEmpty,
  IsDateString
} from "class-validator";
import { GenderEnum } from "src/common/enum/enum";

export class UpdateInfoUserDto {

  // @IsString()
  // @MinLength(2)
  // @MaxLength(40)
  // username: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsString()
   firstName: string;

  @IsString()
 lastName: string;


  @IsDateString()
  @IsNotEmpty()
  dob: string;   // e.g. 2023-12-04

  @IsString()
  @Matches(/^[0-9]{11}$/)  // 11 digits
  mobileNumber: string;
}


export class UpdatePasswordDTO {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  password: string;
}




