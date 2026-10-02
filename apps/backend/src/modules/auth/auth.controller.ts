import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateUserOrLoginDto } from '../user/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() user: CreateUserOrLoginDto
  ): Promise<{ accessToken: string }> {
    return this.authService.login(user);
  }
}
