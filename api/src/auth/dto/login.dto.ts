import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";


export class Login {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Length(5, 100, { message: 'email should be between 5 and 100 characters'})
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'password should be at least 6 characters'})
  @Length(8, 255, { message: 'password should be between 8 and 255 characters'})
  password: string;
}
