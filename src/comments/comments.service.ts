import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { ScyllaDbService } from "src/scylladb/scylladb.service";

@Injectable()
export class CommentsService {
  constructor(private readonly scyllaDbService: ScyllaDbService) {}

  async addComment(
    videoId: string,
    userId: string,
    content: string,
    parentCommentId?: string
  ) {
    const commentId = randomUUID();
    const query = `INSERT INTO comments (video_id, comment_id, parent_comment_id, user_id, content, likes, dislikes, created_at)
                   VALUES (?, ?, ?, ?, ?, 0, 0, toTimestamp(now()))`;
    await this.scyllaDbService
      .getClient()
      .execute(query, [
        videoId,
        commentId,
        parentCommentId || null,
        userId,
        content,
      ]);
    return { commentId };
  }

  async likeComment(
    videoId: string,
    commentId: string,
    type: "like" | "dislike"
  ) {
    const counter = type === "like" ? "likes" : "dislikes";
    const query = `UPDATE comments SET ${counter} = ${counter} + 1 WHERE video_id = ? AND comment_id = ?`;
    await this.scyllaDbService.getClient().execute(query, [videoId, commentId]);
  }

  async getComments(
    videoId: string,
    sort: "top" | "newest",
    pageSize = 10,
    pageToken?: string
  ) {
    let query: string;
    if (sort === "newest") {
      query = `SELECT * FROM comments WHERE video_id = ? LIMIT ?`;
    } else {
      query = `SELECT * FROM top_comments WHERE video_id = ? LIMIT ?`;
    }
    const result = await this.scyllaDbService
      .getClient()
      .execute(query, [videoId, pageSize]);
    return result.rows;
  }
}
