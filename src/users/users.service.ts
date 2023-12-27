import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(body: any): Promise<any> {
    const record = new this.userModel(body);
    const user = await record.save();
    if (user) return user;
    return false;
  }

  // @desc    method to find user record
  async findUserByQuery(...query: any): Promise<any> {
    const user = await this.userModel.findOne(...query);
    if (!user) return false;
    return user;
  }

  //create a function that return single user

  async getUserData(req: any) {
    try {
      const info: any = req.user;
      if (!info || !info._id) {
        throw new NotFoundException('User ID not provided in the request');
      }
      const user = await this.userModel.findOne(
        {
          _id: new Types.ObjectId(info._id),
        },
        { password: 0 },
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Could not get user: ${error.message}`);
    }
  }

  //update profile

  async updateProfile(req: any, profileData: any) {
    try {
      const userInfo: any = req.user;
      const user = await this.userModel.findOne({ _id: userInfo._id });
      if (!user) throw new NotFoundException('User does not exists.');
      if (profileData.email != user.email)
        throw new BadRequestException("Email can't change");
      await user.set({ ...profileData }).save();
      return {
        success: true,
        message: 'profile updated successfully.',
      };
    } catch (error) {
      throw new Error('Failed to update profile: ' + error.message);
    }
  }
}
