import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDTO } from './dto/login.dto';
import { RegisterUserDTO } from './dto/register.dto';
import { UserLoginResponseDTO } from './dto/userLoginResponse.dto';
import { UserRegisterResponseDTO } from './dto/userRegisterResponse.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
    type: UserRegisterResponseDTO,
  })
  async registerUser(@Body() data: RegisterUserDTO) {
    return await this.authService.register(data);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully authenticated.',
    type: UserLoginResponseDTO,
  })
  @ApiResponse({ status: 401, description: 'Wrong email or password' })
  @ApiBody({ type: LoginUserDTO, required: true })
  async login(@Body() loginData: LoginUserDTO): Promise<UserLoginResponseDTO> {
    return this.authService.login(loginData);
  }
}
