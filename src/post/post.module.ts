import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { natsConfig } from 'src/nats.config';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostSchema } from './schemas/post';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'post',schema:PostSchema}]),
    ClientsModule.register([{
      name:'MATH_SERVICE',
      ...natsConfig
    }]),
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
