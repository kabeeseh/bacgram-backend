import { Get, Headers, HttpException, Injectable } from '@nestjs/common';
import { decode, verify } from 'jsonwebtoken';
import { prisma } from '../prisma';

@Injectable()
export class PostsService {
  async getPosts(authHeader: string) {
    try {
      const auth = authHeader.split(' ')[1];

      if (!auth || !verify(auth, 'secret'))
        throw new HttpException('Unauthorized', 401);

      const decoded: { username: string; id: string } = (await decode(
        auth,
      )) as any;
      const posts = await prisma.post.findMany({
        where: {
          authorId: {
            not: decoded.id,
          },
          ViewedUsers: {
            none: {
              id: decoded.id,
            },
          },
        },
        include: {
          author: true,
          ViewedUsers: true,
        },
      });

      if (posts.length == 0) throw new HttpException('No posts found', 404);

      await posts.map(async (post) => {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            views: {
              increment: 1,
            },
            ViewedUsers: {
              connect: { id: decoded.id },
            },
          },
        });
      });

      return { posts };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
  async getUserPosts(authHeader: string) {
    try {
      const auth = authHeader.split(' ')[1];

      if (!auth || !verify(auth, 'secret'))
        throw new HttpException('Unauthorized', 401);

      const decoded: { username: string; id: string } = (await decode(
        auth,
      )) as any;
      const posts = await prisma.post.findMany({
        where: {
          authorId: decoded.id,
        },
        include: {
          author: true,
          ViewedUsers: true,
        },
      });

      if (posts.length == 0) throw new HttpException('No posts found', 404);

      await posts.map(async (post) => {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            views: {
              increment: 1,
            },
            ViewedUsers: {
              connect: { id: decoded.id },
            },
          },
        });
      });

      return { posts };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
  async createPost(title: string, content: string, authHeader: string) {
    try {
      const auth = authHeader.split(' ')[1];
      if (!auth || !verify(auth, 'secret'))
        throw new HttpException('Unauthorized', 401);

      const decoded: { username: string; id: string } = decode(auth) as any;

      await prisma.post.create({
        data: {
          title,
          content,
          authorId: decoded.id,
        },
      });

      return { message: 'Post created successfully' };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
