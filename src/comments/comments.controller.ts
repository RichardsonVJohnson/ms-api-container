import { Controller, Get, Post, Param, Query, Body } from "@nestjs/common";
import { CommentsService } from "./comments.service";

@Controller("videos/:videoId/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async addComment(
    @Param("videoId") videoId: string,
    @Body("userId") userId: string,
    @Body("content") content: string,
    @Body("parentCommentId") parentCommentId?: string
  ) {
    return this.commentsService.addComment(
      videoId,
      userId,
      content,
      parentCommentId
    );
  }

  @Post(":commentId/reactions")
  async likeComment(
    @Param("videoId") videoId: string,
    @Param("commentId") commentId: string,
    @Body("type") type: "like" | "dislike"
  ) {
    return this.commentsService.likeComment(videoId, commentId, type);
  }

  @Get()
  async getComments(
    @Param("videoId") videoId: string,
    @Query("sort") sort: "top" | "newest",
    @Query("pageSize") pageSize: number,
    @Query("pageToken") pageToken?: string
  ) {
    return this.commentsService.getComments(videoId, sort, pageSize, pageToken);
  }
}
