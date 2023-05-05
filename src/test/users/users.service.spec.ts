import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from 'src/common/dtos/user.dtos';
import { User, UserDocument } from 'src/common/schemas/user.schema';
import { Role } from 'src/common/types/roles.enum';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

describe('[UsersService]', () => {
  let service: UsersService;
  let fakeUserModel: Partial<Model<UserDocument>>;

  beforeEach(async () => {
    const john = {
      firstname: 'john',
      lastname: 'doe',
      email: 'john.doe@gmail.com',
    };
    fakeUserModel = {
      create: jest.fn().mockReturnValue(john),
      findById: jest.fn().mockReturnValue({ ...john, id: '1234' }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue(john),
      }),
      find: jest.fn().mockReturnValue(['user1', 'user2', 'user3']),
      findByIdAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue(john),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        Logger,
        {
          provide: getModelToken(User.name),
          useValue: fakeUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('👤 User creating', () => {
    const dto: Partial<CreateUserDto> = {
      firstname: 'john',
      lastname: 'doe',
      email: 'john.doe@gmail.com',
    };
    beforeEach(async () => {
      await service.create(dto as CreateUserDto);
    });

    it('should call model to create a new user and return it', async () => {
      expect(fakeUserModel.create).toReturnWith({
        firstname: 'john',
        lastname: 'doe',
        email: 'john.doe@gmail.com',
      });
    });

    it('should add roles, createdAt, updatedAt and uuid', async () => {
      const spy = jest.spyOn(fakeUserModel, 'create');
      expect(spy).toBeCalledWith({
        ...dto,
        uuid: expect.any(String),
        roles: [Role.ROLE_USER],
        createdAt: expect.any(Date),
        updatedAt: null,
      });
    });
  });

  describe('🔍 User retrieving', () => {
    it('should call model to retrieve an user with id', async () => {
      const id = '1234';
      const user = await service.findOne(id);
      expect(fakeUserModel.findById).toBeCalledWith(id);
      expect(user).toStrictEqual({
        id: '1234',
        firstname: 'john',
        lastname: 'doe',
        email: 'john.doe@gmail.com',
      });
    });

    it('should call model to retrieve an user with email', async () => {
      const email = 'john.doe@gmail.com';
      const user = await service.findByEmail(email);
      expect(fakeUserModel.findOne).toBeCalledWith({ email });
      expect(user).toStrictEqual({
        firstname: 'john',
        lastname: 'doe',
        email: 'john.doe@gmail.com',
      });
    });

    it('should call model and return all users', async () => {
      const users = await service.findAll();
      expect(fakeUserModel.find).toBeCalled();
      expect(users).toStrictEqual(['user1', 'user2', 'user3']);
    });
  });

  describe('🔄 User updating', () => {
    const id = '1234';
    const dto = {
      firstname: 'jane',
      lastname: 'doe',
      email: 'jane.doe@gmail.com',
      save: jest.fn(),
    };

    it('should call model to udapte an user', async () => {
      await service.update(id, dto as unknown as UpdateUserDto);
      expect(dto.save).toBeCalled();
    });

    it('should call model to udapte an user', async () => {
      await service.update(id, dto as unknown as UpdateUserDto);
      expect(dto.save).toBeCalled();
    });
  });

  describe('🗑️  User removing', () => {
    it('should call model to delete an user and return it', async () => {
      const deletedUser = await service.remove('1234');
      expect(fakeUserModel.findByIdAndDelete).toBeCalledWith('1234');
      expect(deletedUser).toStrictEqual({
        firstname: 'john',
        lastname: 'doe',
        email: 'john.doe@gmail.com',
      });
    });
  });
});
