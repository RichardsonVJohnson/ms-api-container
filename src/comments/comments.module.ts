import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { ScyllaDbModule } from 'src/scylladb/scylladb.module';

@Module({
  controllers: [ScyllaDbModule,CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
