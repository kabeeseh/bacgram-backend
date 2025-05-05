import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { SignupController } from './signup/signup.controller';
import { LoginController } from './login/login.controller';
import { PostsService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller';

@Module({
  imports: [],
  controllers: [AppController, SignupController, LoginController, PostsController],
  providers: [AppService, AuthService, PostsService],
})
export class AppModule {}
