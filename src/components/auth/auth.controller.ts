import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiResponse({
    status: 201,
    description: 'User created account successfully.',
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @ApiResponse({
    status: 201,
    description: 'User signed in successfully.',
  })
  async signIn(@Body() signInDto: SignUpDto) {
    return await this.authService.signIn(signInDto);
  }

  @Get('resend-verify-code')
  async resendVerifyCode(@Query('email') email: string) {
    return await this.authService.resendVerifyCode(email);
  }

  @Get('verify-account')
  async verifyAccount(
    @Query('email') email: string,
    @Query('verifyCode') verifyCode: string,
  ) {
    return await this.authService.verifyAccount(email, verifyCode);
  }
}
