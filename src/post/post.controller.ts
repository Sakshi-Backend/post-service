import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService:PostService){}
  
  /**
   * API to create post
   * @param post 
   * @returns newly created post
   */
  @Post()
  async createPost(@Body() post,@Req() req){
    try {
        return this.postService.createPost(post,req)
    } catch (error) {
     throw error;   
    }
  }
  
  /**
   * API to update the post
   * @param post 
   * @param postId 
   * @returns updated post
   */
  @Patch('/:postId')
  async updatePost(@Body() post,@Param('postId') postId,@Req() req){
   try {
    return this.postService.updatePost(post,postId,req);
   } catch (error) {
    throw error;
   }
  }
}
