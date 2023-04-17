import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(signUpDto.password, saltOrRounds);

    const user = new User();

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.email = signUpDto.email;
    user.password = passwordHash;
    user.verifyCode = verifyCode;
    user.isVerified = false;

    try {
      const newUser = await this.userService.create(user);

      await this.sendMailToVerify(newUser.email, newUser.verifyCode);

      return newUser;
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

    if (!user.isVerified) {
      throw new HttpException(
        'Please verify your account.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { email: user.email };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async verifyAccount(
    email: string,
    verifyCode: string,
  ): Promise<{ message: string }> {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    if (user.isVerified) {
      throw new HttpException('User already verified.', HttpStatus.BAD_REQUEST);
    }

    if (user.verifyCode !== verifyCode) {
      throw new HttpException(
        'Verify code is not correct.',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.isVerified = true;

    await this.userService.update(user);

    return { message: 'Account verified successfully.' };
  }

  async sendMailToVerify(email: string, verifyCode: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your account',
      html: `<p>Please input code <b>${verifyCode}</b> to verify account</p>`,
    });
  }

  async resendVerifyCode(email: string): Promise<{ message: string }> {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    if (user.isVerified) {
      throw new HttpException('User already verified.', HttpStatus.BAD_REQUEST);
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyCode = verifyCode;

    await this.userService.update(user);

    await this.sendMailToVerify(user.email, user.verifyCode);

    return { message: 'Email sent successfully.' };
  }
}
