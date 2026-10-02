import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CreateUserOrLoginDto } from '../user/dto';

const TOKEN_EXPIRATION_DAYS = '30d';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login({
    username,
    password,
  }: CreateUserOrLoginDto): Promise<{ accessToken: string }> {
    this.logger.verbose(`Attempting login for username: ${username}`);

    try {
      const user = await this.userService.findByUsername(username);

      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error('Incorrect password');
      }

      const payload = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: TOKEN_EXPIRATION_DAYS,
      });

      this.logger.log(`User "${username}" logged in successfully`);
      return { accessToken };
    } catch {
      this.logger.warn(`Login attempt failed for user "${username}"`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
