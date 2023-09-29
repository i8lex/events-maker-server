import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/api/user/user.service';
import { LoginUserDTO } from './dto/login.dto';
import { UserLoginResponseDTO } from './dto/userLoginResponse.dto';
import { RegisterUserDTO } from './dto/register.dto';
import * as jwt from 'jsonwebtoken';
import { UserRegisterResponseDTO } from './dto/userRegisterResponse.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async register(cred: RegisterUserDTO): Promise<UserRegisterResponseDTO> {
    const { name, email, password } = cred;
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    const existingEmail = await this.userService.findUserByEmail(email);
    const existingName = await this.userService.findUserByName(name);

    if (existingName) {
      throw new BadRequestException('User with this name already exists');
    }
    if (existingEmail) {
      throw new BadRequestException('User with this email already exists');
    }
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(password)) {
      throw new BadRequestException('Password must meet the criteria');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      confirmationCode: token,
    });
    await newUser.save();
    return {
      name,
      token,
      email: newUser.email,
      message: 'User successfully registered',
    };
  }
  async login(cred: LoginUserDTO): Promise<UserLoginResponseDTO | Error> {
    const user = await this.validateUser(cred.email, cred.password);
    if (!user) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!user.isConfirmed) {
      throw new HttpException(
        "Please activate you're account",
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user.isConfirmed) {
      const token = this.jwtService.sign(
        { id: user._id },
        { expiresIn: '24h' },
      );
      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        isConfirmed: user.isConfirmed,
        token: token,
      };
    }

    throw new HttpException('Wrong email or password', HttpStatus.UNAUTHORIZED);
  }

  async confirmEmail(token: string): Promise<UserRegisterResponseDTO> {
    const { email } = this.jwtService.verify(token);
    if (!email) {
      throw new NotFoundException('Invalid token');
    }
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isConfirmed = true;
    await user.save();
    return {
      email: user.email,
      message: 'User successfully confirmed',
    };
  }

  async repeatConfirmEmail(
    user,
  ): Promise<{ email: string; name: string; token: string }> {
    const { email } = user;
    const userData = await this.userService.findUserByEmail(email);
    if (!userData) {
      throw new NotFoundException('User not found');
    }
    const { name } = userData;
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    console.log({ token, email, name });
    userData.confirmationCode = token;
    await userData.save();
    return { token, email, name };
  }
  public async getUserFromAuthenticationToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    const userId = payload.id;
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }
    const user = await this.userModel.findById(userId).exec();
    return { username: user.name, userId: user._id };
  }
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (user && passwordIsMatch) {
      return user;
    }

    throw new HttpException('Wrong email or password', HttpStatus.UNAUTHORIZED);
  }
}
