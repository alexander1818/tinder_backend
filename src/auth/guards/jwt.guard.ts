import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(
    context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization
      .replace(/\bBearer\b/g, '')
      .trim();

    if (!token) {
      throw new UnauthorizedException('Error authorization');
    }

    const validToken = await this.authService.verifyToken(token);

    if (validToken?.error) {
      throw new UnauthorizedException(validToken.error.message);
    }

    return (request.token = token);
  }
}
