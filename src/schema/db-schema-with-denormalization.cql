-- Keyspace
CREATE KEYSPACE youtube_comments
WITH replication = { 'class': 'SimpleStrategy', 'replication_factor': 3 };

-- Comments Table
CREATE TABLE youtube_comments.comments (
    video_id UUID,          -- ID of the video
    comment_id UUID,        -- Unique comment identifier
    user_id UUID,           -- User who made the comment
    content TEXT,           -- Comment content
    likes COUNTER,
    dislikes COUNTER,
    created_at TIMESTAMP,   -- Comment creation timestamp
    PRIMARY KEY (video_id, created_at, comment_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- Replies Table
CREATE TABLE youtube_comments.replies (
    parent_comment_id UUID, -- ID of the parent comment
    reply_id UUID,          -- Unique reply identifier
    user_id UUID,           -- User who made the reply
    content TEXT,           -- Reply content
    created_at TIMESTAMP,   -- Reply creation timestamp
    PRIMARY KEY (parent_comment_id, reply_id)
);

-- Top Comments Ranking Table
CREATE TABLE youtube_comments.top_comments (
    video_id UUID,
    rank_score DOUBLE, -- Calculated score for ranking
    comment_id UUID,
    PRIMARY KEY ((video_id), rank_score, comment_id)
) WITH CLUSTERING ORDER BY (rank_score DESC);
