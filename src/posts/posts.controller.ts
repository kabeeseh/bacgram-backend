import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(@Headers('Authorization') authHeader: string) {
    return this.postsService.getPosts(authHeader.split(' ')[1]);
  }

  @Post()
  createPost(
    @Headers('Authorization') authHeader: string,
    @Body() body: { title: string; content: string },
  ) {
    return this.postsService.createPost(
      authHeader.split(' ')[1],
      body.title,
      body.content,
    );
  }
  @Get('/user')
  getUserPosts(@Headers('Authorization') authHeader: string) {
    return this.postsService.getUserPosts(authHeader.split(' ')[1]);
  }
}
