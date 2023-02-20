import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JWTGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JWTGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req, @Res() res) {
    const token = req.headers.authorization;

    const user = await this.authService.getUserByTokenData(token);
    return res.send(user);
  }
}
