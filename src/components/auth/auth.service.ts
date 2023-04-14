import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(signUpDto.password, saltOrRounds);

    const user = new User();

    user.email = signUpDto.email;
    user.password = passwordHash;
    user.verifyCode = '123456';
    user.isVerified = false;

    try {
      return await this.userService.create(user);
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(signInDto.email);

    if (!user) {
      throw new HttpException(
        'Email or password is not correct.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException(
        'Email or password is not correct.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { email: user.email };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
