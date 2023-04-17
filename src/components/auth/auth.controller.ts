import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { UserService } from './../user/user.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { GqlAuthGuard } from './gql-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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

  @Get('user')
  @UseGuards(GqlAuthGuard)
  async getUser(@CurrentUser() user: User) {
    const { email } = user;
    return await this.userService.findOne(email);
  }
}
