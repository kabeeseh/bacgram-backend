import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { isEmpty } from 'src/isEmpty';
import { prisma } from 'src/prisma';

@Injectable()
export class AuthService {
  async signup(username: string, password: string) {
    try {
      if (!username || !password || isEmpty([username, password])) {
        throw new BadRequestException('Username and password cannot be empty');
      }

      const userCheck = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (userCheck) {
        throw new ConflictException('Username already exists');
      }
      const user = await prisma.user.create({
        data: {
          username: username,
          password: await hash(password, 10),
        },
      });

      const token = await sign(
        { id: user.id, username },
        process.env.JWT_SECRET as string,
      );

      return { token };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException('Error during signup: ' + error.message, 500);
    }
  }
  async login(username: string, password: string) {
    try {
      if (!username || !password || isEmpty([username, password])) {
        throw new HttpException('Username and password cannot be empty', 400);
      }

      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        throw new NotFoundException('Invalid username or password');
      }

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid username or password');
      }

      const token = await sign(
        { id: user.id, username },
        process.env.JWT_SECRET as string,
      );

      return { token };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException('Error during login: ' + error.message, 500);
    }
  }
}
