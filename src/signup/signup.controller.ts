import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('api/signup')
export class SignupController {
  constructor(readonly authService: AuthService) {}
  @Post()
  async signup(@Body() body: { username: string; password: string }) {
    const { username, password } = body;

    if (!username || !password || username.length < 3 || password.length < 6) {
      throw new HttpException('Invalid username or password', 400);
    }

    return this.authService.signup(username, password);
  }
}
