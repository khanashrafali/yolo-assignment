import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { regexes } from 'src/utils/constants/global';

// class validation for login
export class LoginUserDto {
  @ApiProperty({
    description: 'email address of the user',
    example: 'example@test.com',
  })
  @Matches(regexes.emailRegex, {
    message: 'Must be a valid email address',
  })
  @IsNotEmpty({ message: 'Must provide email address' })
  email: string;

  @ApiProperty({
    description: 'password of the user account',
    example: 'Abc@123.#',
  })
  @IsNotEmpty({ message: 'Must proide password' })
  @Matches(regexes.passwordRegex, {
    message:
      'Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;
}

// class validation for register
export class SignUpUserDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'name',
  })
  @IsNotEmpty({ message: 'Please enter your name' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'email address of the user',
    example: 'example@test.com',
  })
  @Matches(regexes.emailRegex, {
    message: 'Must be a valid email address',
  })
  @IsNotEmpty({ message: 'Must provide email address' })
  email: string;

  @ApiProperty({
    description: 'password of the user account',
    example: 'Abc@123.#',
  })
  @IsNotEmpty({ message: 'Must proide password' })
  @Matches(regexes.passwordRegex, {
    message:
      'Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;
}

export class UpdateProfile {
  @ApiProperty({
    description: 'Name of the user',
    example: 'name',
  })
  @IsOptional({ message: 'Please enter your name' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'email address of the user',
    example: 'example@test.com',
  })
  @Matches(regexes.emailRegex, {
    message: 'Must be a valid email address',
  })
  @IsOptional({ message: 'provide email address' })
  email: string;
}
