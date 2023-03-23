import { Body, Controller, Param, Patch, Post, Query } from '@nestjs/common';
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
  async createPost(@Body() post){
    try {
        return this.postService.createPost(post)
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
  async updatePost(@Body() post,@Param('postId') postId){
   try {
    return this.postService.updatePost(post,postId);
   } catch (error) {
    throw error;
   }
  }
}
