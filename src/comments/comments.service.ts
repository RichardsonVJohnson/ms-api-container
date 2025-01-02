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
    pageToken?: string,
    includeReplies = false
  ) {
    let query: string;
    const params: any[] = [videoId];

    if (sort === "newest") {
      query = `SELECT * FROM comments WHERE video_id = ?`;
    } else {
      query = `SELECT * FROM top_comments WHERE video_id = ?`;
    }

    // Add pagination logic using pageToken
    if (pageToken) {
      query += ` AND id > ?`; // Assuming `id` is your unique identifier for comments
      params.push(pageToken);
    }

    query += ` LIMIT ?`;
    params.push(pageSize);

    const result = await this.scyllaDbService
      .getClient()
      .execute(query, params);

    // Fetch replies if requested
    if (includeReplies) {
      for (const comment of result.rows) {
        const repliesResult = await this.getReplies(comment.id, 5); // Fetch 5 replies per comment
        comment.replies = repliesResult.replies;
      }
    }
    // Determine the next page token (if more rows exist)
    const nextPageToken =
      result.rows.length === pageSize
        ? result.rows[result.rows.length - 1].id
        : null;

    return {
      comments: result.rows,
      nextPageToken,
    };
  }
  async getReplies(commentId: string, pageSize = 10, pageToken?: string) {
    let query = `SELECT * FROM replies WHERE parent_comment_id = ?`;
    const params: any[] = [commentId];

    // Handle pagination
    if (pageToken) {
      query += ` AND id > ?`;
      params.push(pageToken);
    }

    query += ` LIMIT ?`;
    params.push(pageSize);

    const result = await this.scyllaDbService
      .getClient()
      .execute(query, params);

    // Determine next page token
    const nextPageToken =
      result.rows.length === pageSize
        ? result.rows[result.rows.length - 1].id
        : null;

    return {
      replies: result.rows,
      nextPageToken,
    };
  }
}
