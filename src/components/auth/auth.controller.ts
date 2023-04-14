import { Body, Controller, Inject, Post } from '@nestjs/common';
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
}
