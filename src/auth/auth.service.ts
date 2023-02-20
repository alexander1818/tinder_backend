import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/users.schema';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string): Promise<User | null> {
    const user = await this.userService.findOne(username);

    if (!user) return null;

    return user;
  }

  async generateAccessToken(user: User) {
    return {
      access_token: this.jwtService.sign(
        { user },
        { secret: jwtConstants.secret, expiresIn: '60s' },
      ),
    };
  }

  async generateRefreshToken(userId: string) {
    return {
      refresh_token: this.jwtService.sign(
        { userId },
        { secret: jwtConstants.secret, expiresIn: '30d' },
      ),
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    } catch (error) {
      return { error };
    }
  }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }

  async getUserByTokenData(token: string): Promise<User> {
    const parsedTokenData = this.parseJwt(token);

    return await this.userService.findOne(parsedTokenData.user.username);
  }
}
