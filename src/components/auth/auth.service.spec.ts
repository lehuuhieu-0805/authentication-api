/* eslint-disable @typescript-eslint/no-empty-function */
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

describe('AuthService', () => {
  const mockSignUp: SignUpDto = {
    email: 'hieu@gmail.com',
    password: '12345678',
  };
  const mockSignIn: SignInDto = {
    email: 'hieu@gmail.com',
    password: '12345678',
  };

  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('auth service should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('user service should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('when user sign up', () => {
    it('should create a new user', async () => {
      const passwordHash = await bcrypt.hash(mockSignUp.password, 10);
      const user = new User();
      user.email = mockSignUp.email;
      user.password = passwordHash;
      user.verifyCode = '123456';
      user.isVerified = false;

      // mockResolvedValueOnce is used to mock the result of a asynchronous function that returns a Promise
      // mockReturnValueOnce is used to mock the result of a synchronous function that returns a value
      jest.spyOn(userService, 'create').mockResolvedValueOnce(user);

      const result = await authService.signUp(mockSignUp);

      expect(await bcrypt.compare(mockSignUp.password, result.password)).toBe(
        true,
      );

      expect(result).toEqual(user);
    });

    it('throw an ConflictException if user sign up with a email that is exists', async () => {
      await authService.signUp(mockSignUp);

      // mock service method
      const error = new Error('Email already exists');
      jest.spyOn(userService, 'create').mockRejectedValue(error);

      // call authService method and check if it throws ConflictException
      await expect(authService.signUp(mockSignUp)).rejects.toThrowError(
        new HttpException('Email already exists', HttpStatus.CONFLICT),
      );
    });

    it('throw an InternalServerErrorException if user sign up with a email that is exists', async () => {
      // mock service method
      const error = new Error('Unknown error');
      jest.spyOn(userService, 'create').mockRejectedValueOnce(error);

      // call authService method and check if it throws ConflictException
      await expect(authService.signUp(mockSignUp)).rejects.toThrowError(
        new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('when user sign in', () => {
    it('should return access_token', async () => {
      const access_token = 'access_token';
      const user = new User();
      user.email = mockSignIn.email;
      user.password = await bcrypt.hash(mockSignIn.password, 10);
      user.verifyCode = '123456';
      user.isVerified = false;

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

      expect(await bcrypt.compare(mockSignIn.password, user.password)).toBe(
        true,
      );

      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(access_token);

      const result = await authService.signIn(mockSignIn);

      expect(result.access_token).toEqual(access_token);
    });

    it('should throw UnauthorizedException if user sign in with a email is not existed', async () => {
      const error = new UnauthorizedException(
        'Email or password is not correct.',
      );

      jest.spyOn(userService, 'findOne').mockRejectedValueOnce(error);

      try {
        await authService.signIn(mockSignIn);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('Email or password is not correct.');
        expect(error.status).toEqual(HttpStatus.UNAUTHORIZED);
      }
    });

    it('should throw UnauthorizedException if user sign in with wrong password', async () => {
      const user = new User();
      user.email = mockSignIn.email;
      user.password = await bcrypt.hash('test', 10);
      user.verifyCode = '123456';
      user.isVerified = false;

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

      expect(await bcrypt.compare(mockSignIn.password, user.password)).toBe(
        false,
      );

      const error = new UnauthorizedException(
        'Email or password is not correct.',
      );

      jest
        .spyOn(bcrypt, 'compare')
        .mockRejectedValueOnce(error as unknown as never);

      try {
        await authService.signIn(mockSignIn);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('Email or password is not correct.');
        expect(error.status).toEqual(HttpStatus.UNAUTHORIZED);
      }
    });
  });
});
