import { IsEmail, IsString } from "class-validator";


export class UserLoginDto {
    @IsEmail({}, {message: 'neverniy email'})
    email: string;

    @IsString()
    password: string;
}