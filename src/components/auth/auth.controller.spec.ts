import { Test } from '@nestjs/testing';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

describe('AuthController', () => {
  const mockSignUp: SignUpDto = {
    email: 'hieu',
    password: '1',
  };

  const mockSignIn: SignInDto = {
    email: 'hieu',
    password: '1',
  };

  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sign-up', () => {
    it('should create a new user', async () => {
      const user: User = {
        email: mockSignUp.email,
        password: mockSignUp.password,
        verifyCode: '123456',
        isVerified: false,
      };

      // mock service method
      jest.spyOn(service, 'signUp').mockResolvedValueOnce(user);

      // call controller method
      const result = await controller.signUp(mockSignUp);

      // check result
      expect(result).toEqual(user);

      // check if service method was called with correct argument
      expect(service.signUp).toHaveBeenCalledWith(mockSignUp);
    });
  });

  describe('sign-in', () => {
    it('should return a token', async () => {
      const access_token = 'token';

      // mock service method
      jest
        .spyOn(service, 'signIn')
        .mockResolvedValueOnce({ access_token: 'token' });

      // call controller method
      const result = await controller.signIn(mockSignIn);

      // check result
      expect(result.access_token).toEqual(access_token);
    });
  });
});
