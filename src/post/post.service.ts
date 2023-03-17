import { Inject, Injectable } from '@nestjs/common';
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
        console.log(logData)
        this.client.emit('create-log',logData)
        return newPost;
    }

    async updatePost(post,postId){
        console.log(post,postId)
     const oldPost=await this.postModel.findById(postId.id);
     const updatedPost = await this.postModel.findOneAndUpdate(
        postId,{
            content:post.content
        },
        {new:true}
        ) 
        const logData = {
            tableId:1,
            rowId:postId.id,
            action:"updated the post",
            oldData:oldPost,
            newData:updatedPost,
            ipAddress:post.ipAddress,
            user:{id:post.authorId},
            miscellaneous:post.miscellaneous
        }
        this.client.emit('create-log',logData) 
     return updatedPost;
    }
}
