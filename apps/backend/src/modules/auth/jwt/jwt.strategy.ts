import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';
import { getJwtSecret } from '../../../config/jwt-secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });

    Logger.log('JwtStrategy initialized');
  }

  async validate(payload: { id: string }): Promise<User> {
    const user = await this.userService.getUserById(payload.id);

    Logger.log('JWT payload:', payload);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
