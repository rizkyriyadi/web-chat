// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
