import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Headers('x-request-id') requestId: string, @Body() authDto: AuthDto) {
    return this.authService.signup(requestId, authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Headers('x-request-id') requestId: string, @Body() authDto: AuthDto) {
    return this.authService.signin(requestId, authDto);
  }
}
