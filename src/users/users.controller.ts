import {
  Controller,
  UseGuards,
  Get,
  Req,
  HttpException,
  HttpStatus,
  Put,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateProfile } from './dtos/users.dto';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getUserData(@Req() req: Request) {
    try {
      return await this.usersService.getUserData(req);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateProfile(@Req() req: Request, @Body() profileData: UpdateProfile) {
    try {
      const result = await this.usersService.updateProfile(req, profileData);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
