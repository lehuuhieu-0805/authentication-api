/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

describe('AuthService', () => {
  const mockSignUp: SignUpDto = {
    email: 'hieu',
    password: '1',
  };

  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
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
});
