import {
  BadRequestException,
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

    // mail logic here !!

    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.confirmationCode = token;
    await this.userService.createUser(newUser);
    return {
      email: newUser.email,
      message: 'User successfully registered',
    };
  }
  async login(cred: LoginUserDTO): Promise<UserLoginResponseDTO> {
    const user = await this.validateUser(cred.email, cred.password);
    if (!user) {
      throw new NotFoundException('Wrong email or password');
    }
    if (!user.isConfirmed) {
      throw new UnauthorizedException('User is not confirmed');
    }
    if (user.isConfirmed) {
      const token = this.jwtService.sign(
        { id: user._id },
        { expiresIn: '24h' },
      );
      return {
        _id: user._id,
        email: user.email,
        isConfirmed: user.isConfirmed,
        token: token,
      };
    }

    throw new UnauthorizedException('Something went wrong');
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (user && passwordIsMatch) {
      return user;
    }

    throw new UnauthorizedException('Something went wrong');
  }
}
