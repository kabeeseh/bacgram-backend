import { HttpException, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import { prisma } from 'src/prisma';

@Injectable()
export class AuthService {
  async signup(username: string, password: string) {
    try {
      const userCheck = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (userCheck) throw new HttpException('User already exists', 400);

      const user = await prisma.user.create({
        data: {
          username,
          password: await hash(password, 10),
        },
      });

      const token = await sign({ id: user.id, username }, 'secret');

      return { token };
    } catch (error: any) {
      throw new HttpException(error, 500);
    }
  }
  async login(username: string, password: string) {
    try {
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user) throw new HttpException('User not found', 404);

      const passValid = await compare(password, user.password);

      if (!passValid) throw new HttpException('Invalid Password', 400);

      const token = await sign({ id: user.id, username }, 'secret');

      return { token };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
