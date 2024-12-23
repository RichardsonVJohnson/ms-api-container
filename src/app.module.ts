// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ScyllaDbModule } from './scylladb/scylladb.module';
import { AppService } from './app.service';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [ScyllaDbModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}