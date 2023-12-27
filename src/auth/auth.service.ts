import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto, SignUpUserDto } from 'src/users/dtos/users.dto';
import { compareHash } from 'src/utils/helper/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  //  generate a new token
  generateNewToken = async (
    user: any,
    secretKey: any,
    expiresIn: string = '24h',
  ) => {
    const payload = {
      id: user._id,
      email: user.email,
    };

    // create jwt
    return this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn,
    });
  };

  async logout(userId: string) {
    // Find the user by userId
    const user = await this.usersService.findUserByQuery({
      _id: userId,
    });

    if (user) {
      // Clear the active session token
      user.activeSessionToken = null;
      await user.save();
    }
  }

  async registerUser(createUserDto: SignUpUserDto) {
    try {
      // Check user exists
      const isExist = await this.usersService.findUserByQuery({
        $and: [{ email: createUserDto.email }],
      });
      if (isExist) throw new BadRequestException('User account already exists');
      const user = await this.usersService.createUser(createUserDto);

      if (!user) throw new BadRequestException('Unable to create user account');

      return {
        message: 'User registered successfully.',
      };
    } catch (error) {
      throw new Error(`Could not create user: ${error.message}`);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    // Check user exists

    const isUser = await this.usersService.findUserByQuery({
      $and: [{ email: loginUserDto.email }],
    });
    if (!isUser) throw new NotFoundException('User account does not exists');

    // Check password matches
    const passMatch = await compareHash(loginUserDto.password, isUser.password);
    if (!passMatch)
      throw new BadRequestException('Invalid credentials provided');

    if (isUser.activeSessionToken) {
      // Log out the user from the previous device
      await this.logout(isUser._id);
    }

    // generate access token
    const accessToken = await this.generateNewToken(
      isUser,
      process.env.JWT_ACCESS_SECRET,
    );

    if (!accessToken)
      throw new BadRequestException('Unable to create authorization access');

    isUser.activeSessionToken = accessToken;
    await isUser.save();

    const payload = {
      email: isUser.email,
      userId: isUser._id,
      name: isUser.name,
    };

    return {
      user: payload,
      token: accessToken,
    };
  }
}
