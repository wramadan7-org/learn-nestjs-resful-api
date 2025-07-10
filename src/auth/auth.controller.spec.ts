import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from 'src/model/user.model';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should return with user data', async () => {
      const request: RegisterUserRequest = {
        username: 'test',
        password: 'test',
        name: 'test',
      };

      const mockResponse: UserResponse = {
        username: request.username,
        name: request.name,
      };

      mockAuthService.register.mockResolvedValue(mockResponse);

      const result: UserResponse = await controller.register(request);

      expect(service.register).toHaveBeenCalledWith(request);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('login', () => {
    it('should return with user data', async () => {
      const request: LoginUserRequest = {
        username: 'test',
        password: 'test',
      };

      const mockResponse: UserResponse = {
        username: request.username,
        name: 'test',
        accessToken: 'jwt',
        refreshToken: 'jwt',
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const result: UserResponse = await controller.login(request);

      expect(service.login).toHaveBeenCalledWith(request);
      expect(result.username).toBe(request.username);
      expect(result.name).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });
});
