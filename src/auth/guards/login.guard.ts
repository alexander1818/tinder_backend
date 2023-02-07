import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   @ts-ignore
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | Promise<boolean> | Observable<boolean>> {
    const request = context.switchToHttp().getRequest();
    const { username, password } = request.body;
    const user = await this.authService.validateUser(username);

    if (!user) {
      throw new UnauthorizedException(`The user ${username} doesn't exist`);
    }

    if (user.password !== password) {
      throw new UnauthorizedException(`Wrong password`);
    }

    return true;
  }
}
