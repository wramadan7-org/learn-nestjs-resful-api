import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { ValidationService } from 'src/common/validation/validation.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockLogger = { info: jest.fn() };

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
    },
  };

  const mockValidationService = {
    validate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ValidationService, useValue: mockValidationService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user response if user is found', async () => {
      const mockUser = {
        id: '83d4e26a-3d4d-49e5-8ed6-6576bc4daa22',
        username: 'test',
        name: 'test',
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findById(
        '83d4e26a-3d4d-49e5-8ed6-6576bc4daa22',
      );

      expect(result).toEqual({
        id: '83d4e26a-3d4d-49e5-8ed6-6576bc4daa22',
        username: 'test',
        name: 'test',
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Find user with ID 83d4e26a-3d4d-49e5-8ed6-6576bc4daa22',
      );
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: '83d4e26a-3d4d-49e5-8ed6-6576bc4daa22' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findCurrent', () => {
    it('should return current user data', async () => {
      const currentUser: User = {
        id: '83d4e26a-3d4d-49e5-8ed6-6576bc4daa22',
        username: 'test',
        name: 'test',
        password: 'hashed',
        token: 'token',
      };

      const result = await service.findCurrent(currentUser);

      expect(result).toEqual({
        username: 'test',
        name: 'test',
      });
    });
  });
});
