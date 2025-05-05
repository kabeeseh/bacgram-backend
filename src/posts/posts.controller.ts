import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  getPosts(@Headers('authorization') authHeader: string) {
    return this.postService.getPosts(authHeader);
  }
  @Post()
  createPost(
    @Headers('authorization') authHeader: string,
    @Body() body: { title: string; content: string },
  ) {
    const { title, content } = body;
    return this.postService.createPost(title, content, authHeader);
  }
  @Get('/user')
  getUserPosts(@Headers('authorization') authHeader: string) {
    return this.postService.getUserPosts(authHeader);
  }
}
