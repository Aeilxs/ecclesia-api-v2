import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto, UpdateUserDto } from 'src/common/dtos/user.dtos';
import { Logger } from '@nestjs/common';

describe('[UsersController]', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUserService = {
      create: jest.fn().mockReturnValue({
        email: 'john@gmail.com',
        password: 'password',
        firstname: 'john',
        lastname: 'doe',
      }),
      findAll: jest.fn().mockReturnValue(['user1', 'user2', 'user3']),
      findOne: jest.fn().mockReturnValue({
        _id: '164542d61343059e957ac8f4a',
        email: 'jane@gmail.com',
        password: 'password',
        firstname: 'jane',
        lastname: 'doe',
      }),
      update: jest
        .fn()
        .mockImplementation((id: string, updateUserDto: UpdateUserDto) =>
          Object.assign(
            {
              _id: '164542d61343059e957ac8f4a',
              email: 'jane@gmail.com',
              password: 'password',
              firstname: 'jane',
              lastname: 'doe',
            },
            updateUserDto,
          ),
        ),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        Logger,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('🔍 (GET)', () => {
    it('should call users service and retrieve an user with given id', async () => {
      const id = '164542d61343059e957ac8f4a';
      const user = await controller.findOne(id);
      expect(fakeUserService.findOne).toBeCalledWith(id);
      expect(user).toEqual({
        _id: '164542d61343059e957ac8f4a',
        email: 'jane@gmail.com',
        password: 'password',
        firstname: 'jane',
        lastname: 'doe',
      });
    });

    it('should call users service and return all users', async () => {
      const users = await controller.findAll();
      expect(fakeUserService.findAll).toBeCalled();
      expect(users).toStrictEqual(['user1', 'user2', 'user3']);
    });
  });

  describe('📤 (POST)', () => {
    it('should call users service and return created user', async () => {
      const userDto: CreateUserDto = {
        email: 'john@gmail.com',
        password: 'password',
        firstname: 'john',
        lastname: 'doe',
      };
      const user = await controller.create(userDto);
      expect(fakeUserService.create).toBeCalled();
      expect(user).toStrictEqual(userDto);
    });
  });

  describe('🔄 (PATCH)', () => {
    it('should call users service and return updated user', async () => {
      const updateDto: Partial<UpdateUserDto> = {
        firstname: 'janette',
        lastname: 'qerg',
      };

      const updatedUser = await controller.update(
        '164542d61343059e957ac8f4a',
        updateDto as UpdateUserDto,
      );

      expect(updatedUser.firstname).toBe(updateDto.firstname);
      expect(updatedUser.lastname).toBe(updateDto.lastname);
      expect(fakeUserService.update).toBeCalledWith(
        '164542d61343059e957ac8f4a',
        updateDto,
      );
    });
  });

  describe('🗑️  (DELETE)', () => {
    it('should call users service to delete user with given id and return it', async () => {
      const id = '164542d61343059e957ac8f4a';
      await controller.remove(id);
      expect(fakeUserService.remove).toBeCalledWith(id);
    });
  });
});
