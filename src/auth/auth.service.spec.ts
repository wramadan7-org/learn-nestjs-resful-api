import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import {
  LoginUserRequest,
  RefreshTokenUserRequest,
} from 'src/model/user.model';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 'uuid',
    username: 'test',
    password: 'test',
    name: 'test',
    refreshToken: '',
    accessToken: '',
  };

  const mockPrismaService = {
    user: {
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockValidationService = {
    validate: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockLogger: Logger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    log: jest.fn(),
  } as any;

  beforeEach(async () => {
    mockUser.password = await bcrypt.hash('test', 10);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ValidationService, useValue: mockValidationService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const request = {
        username: 'test',
        password: 'test',
        name: 'test',
      };
      const hashedPassword = 'test';

      mockValidationService.validate.mockReturnValue(request);
      mockPrismaService.user.count.mockResolvedValue(0);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockPrismaService.user.create.mockResolvedValue({
        username: request.username,
        name: request.name,
      });

      const result = await service.register(request);

      expect(mockValidationService.validate).toHaveBeenCalled();
      expect(mockPrismaService.user.count).toHaveBeenCalledWith({
        where: { username: request.username },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(request.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...request,
          password: hashedPassword,
        },
      });
      expect(result).toEqual({
        username: request.username,
        name: request.name,
      });
    });

    it('should throw if username already exists', async () => {
      const request = {
        username: 'test',
        password: 'test',
        name: 'test',
      };

      mockValidationService.validate.mockReturnValue(request);
      mockPrismaService.user.count.mockResolvedValue(1);

      await expect(service.register(request)).rejects.toThrow(HttpException);

      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const request: LoginUserRequest = {
        username: 'test',
        password: 'test',
      };

      const hashedPassword = 'test';

      mockValidationService.validate.mockReturnValue(request);
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(hashedPassword as never);
      mockPrismaService.user.update.mockImplementation(({ data }) => ({
        ...mockUser,
        token: data.token,
      }));

      const result = await service.login(request);

      expect(result).toHaveProperty('username', mockUser.username);
      expect(result).toHaveProperty('name', mockUser.name);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw if user not found', async () => {
      const request: LoginUserRequest = {
        username: 'notfound',
        password: 'any',
      };

      mockValidationService.validate.mockReturnValue(request);
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.login(request)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if password is invalid', async () => {
      const request: LoginUserRequest = {
        username: 'test',
        password: 'wrong',
      };

      mockValidationService.validate.mockReturnValue(request);
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(request)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('should return new access token', async () => {
      const request: RefreshTokenUserRequest = {
        refreshToken: 'refresh-token',
      };

      const mockPayload = {
        id: 'user-id',
        username: 'test',
        name: 'Test',
        type: 'refresh',
      };

      const mockUser = {
        id: 'user-id',
        username: 'test',
        name: 'Test',
      };

      mockValidationService.validate.mockReturnValue(request);
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('new-access-token');

      const result = await service.refreshAccessToken(request);

      expect(result).toEqual({
        username: mockUser.username,
        name: mockUser.name,
        accessToken: 'new-access-token',
      });
    });

    it('should throw if token type is not refresh', async () => {
      const request: RefreshTokenUserRequest = {
        refreshToken: 'invalid-token',
      };

      mockValidationService.validate.mockReturnValue(request);
      mockJwtService.verifyAsync.mockResolvedValue({ type: 'access' });

      await expect(service.refreshAccessToken(request)).rejects.toThrow(
        'Invalid token type',
      );
    });
  });
});
