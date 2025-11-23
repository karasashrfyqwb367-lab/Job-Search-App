import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO ,ResendOTP, ConfirmEmail, Login, GoogleLoginDto, ForgetPasswordDTO, VerifyForgetPasswordDTO, ResetForgetPasswordDTO } from './dto/user.dto';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService


  ) {}


  @Post("/signup")

  signup(@Body(new ValidationPipe ()) singUPDto:SignupDTO){
    return this.authService.signup(singUPDto);
  }




      @Post("/resend-otp")
 resendOTP(@Body(new ValidationPipe()) resendOTP:ResendOTP){
return this.authService.resendOTP(resendOTP)
 }

  @Patch('/confirm_Email') 
  confirmEmail(@Body(new ValidationPipe()) confirmEmail: ConfirmEmail) {
    return this.authService.confirmEmail (confirmEmail);
  }
    

    

@Post('login')
login(@Body() loginDto: Login) {  
  const { email, password } = loginDto;
return this.authService.login(loginDto)
}


  @Post('google')
  async signupOrLoginWithGoogle(@Body() dto: GoogleLoginDto) {
    return this.authService.signupOrLoginWithGoogle(dto);
  }


 @Post('forget-password')
  async forgetPassword(@Body() dto: ForgetPasswordDTO) {
    return this.authService.forgetPassword(dto.email);
  }

  @Post('verify-forget-password')
  async verifyForgetPassword(@Body() dto: VerifyForgetPasswordDTO) {
    return this.authService.verifyForgetPassword(dto.email, dto.otp);
  }

  @Post('reset-forget-password')
  async resetForgetPassword(@Body() dto: ResetForgetPasswordDTO) {
    return this.authService.resetForgetPassword(dto.email, dto.otp, dto.password);
  }

  

}
