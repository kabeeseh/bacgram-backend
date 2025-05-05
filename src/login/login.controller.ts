import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('api/login')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.authService.login(username, password);
  }
}
