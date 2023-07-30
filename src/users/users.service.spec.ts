import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { IUsersRepository } from "./users.repository.interface";
import { IUserService } from "./users.service.interface";
import { TYPES } from "../types";
import { UserService } from "./users.service";
import { User } from './user.entity';


const ConfigServiceMock: IConfigService= {
    get: jest.fn(),
}

const UsersRepositoryMock: IUsersRepository= {
    find: jest.fn(),
    create: jest.fn()
}


const container = new Container();
let configService: IConfigService;
let UsersRepository: IUsersRepository;
let usersService: IUserService;


beforeAll(() => {
    container.bind<IUserService>(TYPES.UserService).to(UserService);
    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
    container.bind<IUsersRepository>(TYPES.UserRepository).toConstantValue(UsersRepositoryMock);


    configService = container.get<IConfigService>(TYPES.ConfigService);
	UsersRepository = container.get<IUsersRepository>(TYPES.UserRepository);
	usersService = container.get<IUserService>(TYPES.UserService);
});

    let createdUser: UserModel | null;

describe(' User Service', () => {
    it('createUser', async () => {
        configService.get = jest.fn().mockReturnValueOnce('1');
        UsersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
        createdUser = await usersService.createUser({
            email: 'a@a.ru',
            name: 'anton',
            password: '1'
        });

        expect(createdUser?.id).toEqual(1);
        expect(createdUser?.password).not.toEqual('1');
    });

    it('validateUser - success', async () => {
        UsersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
        const res= usersService.validateUser({
            email: 'a@a.ru',
            password: '1',
        });
        expect(res).toBeTruthy();
    });

    it('validateUser - wrong password', async () => {
		UsersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'a@a.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});

    it('validateUser - wrong user', async () => {
		UsersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await usersService.validateUser({
			email: 'a2@a.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
});