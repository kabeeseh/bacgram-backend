import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { decode, verify } from 'jsonwebtoken';
import { isEmpty } from 'src/isEmpty';
import { prisma } from 'src/prisma';

@Injectable()
export class PostsService {
  async getPosts(authHeader: string) {
    try {
      if (
        !authHeader ||
        !verify(authHeader, process.env.JWT_SECRET as string)
      ) {
        throw new BadRequestException('Invalid or missing token');
      }

      const decoded: { id: string; username: string } = decode(
        authHeader,
      ) as any;

      const posts = await prisma.post.findMany({
        where: {
          authorId: {
            not: {
              equals: decoded.id,
            },
          },
          viewedBy: {
            none: {
              id: decoded.id,
            },
          },
        },
        include: {
          author: true,
          viewedBy: true,
        },
      });

      if (posts.length === 0) {
        throw new NotFoundException('No posts found');
      }

      posts.map(async (post) => {
        await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            viewedBy: {
              connect: {
                id: decoded.id,
              },
            },
            views: post.views + 1,
          },
        });
      });

      return { posts };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during getPosts: ' + error.message,
      );
    }
  }
  async createPost(authHeader: string, title: string, content: string) {
    try {
      if (
        !authHeader ||
        !verify(authHeader, process.env.JWT_SECRET as string)
      ) {
        throw new BadRequestException('Invalid or missing token');
      }

      const decoded: { id: string; username: string } = decode(
        authHeader,
      ) as any;

      if (!title || !content || isEmpty([title, content])) {
        throw new BadRequestException('Title and content are required');
      }

      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId: decoded.id,
        },
      });

      return { post };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error during createPost: ' + error.message,
      );
    }
  }
  async getUserPosts(authHeader: string) {
    try {
      if (
        !authHeader ||
        !verify(authHeader, process.env.JWT_SECRET as string)
      ) {
        throw new BadRequestException('Invalid or missing token');
      }

      const decoded: { id: string; username: string } = decode(
        authHeader,
      ) as any;

      const posts = await prisma.post.findMany({
        where: {
          authorId: {
            equals: decoded.id,
          },
        },
        include: {
          author: true,
          viewedBy: true,
        },
      });

      if (posts.length === 0) {
        throw new NotFoundException('No posts found');
      }

      posts.map(async (post) => {
        await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            viewedBy: {
              connect: {
                id: decoded.id,
              },
            },
            views: post.views + 1,
          },
        });
      });

      return { posts };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during getPosts: ' + error.message,
      );
    }
  }
}
