import { IsEmail, IsString } from "class-validator";

export class UserRegisterDto {
    @IsEmail({ }, {message: 'neverno email'})
    email: string;

    @IsString({message: 'ne ykazan password'})
    password: string;

    @IsString({message: 'ne ykazan name'})
    name: string;
}