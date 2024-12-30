-- Keyspace
CREATE KEYSPACE youtube_comments
WITH replication = { 'class': 'SimpleStrategy', 'replication_factor': 3 };

-- Comments Table
CREATE TABLE youtube_comments.comments (
    video_id UUID,
    comment_id UUID,
    parent_comment_id UUID, -- NULL for top-level comments, non-NULL for replies
    user_id UUID,
    content TEXT,
    likes COUNTER,
    dislikes COUNTER,
    created_at TIMESTAMP,
    PRIMARY KEY ((video_id), created_at, comment_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- Top Comments Ranking Table
CREATE TABLE youtube_comments.top_comments (
    video_id UUID,
    rank_score DOUBLE, -- Calculated score for ranking
    comment_id UUID,
    PRIMARY KEY ((video_id), rank_score, comment_id)
) WITH CLUSTERING ORDER BY (rank_score DESC);
