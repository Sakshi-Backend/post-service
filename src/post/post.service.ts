import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument } from './schemas/post';

@Injectable()
export class PostService {
    constructor(
        @InjectModel('post') private postModel:Model<PostDocument>,
        @Inject('MATH_SERVICE') private readonly client: ClientProxy,
      ) {} 

    async createPost(post){
       try{
        const newPost = new this.postModel({
            content:post.content,
            authorId:post.authorId
        });
        await newPost.save();
        const logData = {
            tableId:1,
            rowId:newPost.id,
            action:"created new post",
            oldData:{},
            newData:newPost,
            ipAddress:post.ipAddress,
            user:{id:post.authorId},
            miscellaneous:post.miscellaneous
        }
        this.client.emit('create-log',logData)
        return newPost;
       }catch(error){
        throw new HttpException(
            'Failed to create post',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
       }
    }

    async updatePost(post,postId){
     try {
        const oldPost=await this.postModel.findById(postId);
        if(!oldPost){
            throw new HttpException(
                'Post Not found',
                HttpStatus.BAD_REQUEST,
              );
        }
     const updatedPost = await this.postModel.findByIdAndUpdate(
        {_id:postId},{
            content:post.content
        },
        {new:true}) 
        const logData = {
            tableId:1,
            rowId:postId,
            action:"updated the content of the post",
            oldData:oldPost,
            newData:updatedPost,
            ipAddress:post.ipAddress,
            user:{id:post.authorId},
            miscellaneous:post.miscellaneous
        }
        this.client.emit('create-log',logData) 
     return updatedPost;
     } catch (error) {
        throw new HttpException(
            'Failed to update post',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
     }
    }
}
