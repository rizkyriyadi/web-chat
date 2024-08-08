import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('register')
  getSignupPage(@Res() res: Response): void {
    res.sendFile(join(__dirname, '..', 'public', 'signup.html'));
  }

  @Get('login')
  getLoginPage(@Res() res: Response): void {
    res.sendFile(join(__dirname, '..', 'public', 'login.html'));
  }
}
