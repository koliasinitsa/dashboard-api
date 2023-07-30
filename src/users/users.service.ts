import { inject, injectable } from "inversify";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { IUserService } from "./users.service.interface";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";
import { IUsersRepository } from "./users.repository.interface";
import { UserModel } from "@prisma/client";

@injectable()
export class UserService implements IUserService{
    constructor(
        @inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        ) {}
    async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
        const newUser = new User(email, name);
        const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
        const existedUser = await this.usersRepository.find(email);
        if (existedUser) {
            return  null;
        }
        // проверка что он есть
        //  если есть - возраещеаем null
        // нет- создаем
        return this.usersRepository.create(newUser);
    }

    async getUserInfo(email: string): Promise<UserModel | null> {
        return this.usersRepository.find(email);
    }

    async validateUser({ email, password }: UserLoginDto): Promise<boolean>{
        const existedUser = await this.usersRepository.find(email);
        if (!existedUser) {
            return false;
        }
        const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
        return newUser.comparePassword(password);
    };
}