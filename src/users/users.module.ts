import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { User, UsersSchema } from 'src/schemas/users.schema';
import { UsersController } from './user.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
  ],
  controllers: [UsersController],
  providers: [JwtService, AuthService, UsersService],
  exports: [JwtService, UsersService, AuthService],
})
export class UsersModule {}
