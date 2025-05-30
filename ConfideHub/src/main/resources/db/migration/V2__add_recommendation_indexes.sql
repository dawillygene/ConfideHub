-- Indexes for reactions table
CREATE INDEX IF NOT EXISTS idx_reaction_user_id ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reaction_post_id ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reaction_user_post ON reactions(user_id, post_id);
CREATE INDEX IF NOT EXISTS idx_reaction_type ON reactions(reaction_type);

-- Indexes for posts table
CREATE INDEX IF NOT EXISTS idx_post_categories ON posts USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_post_hashtags ON posts USING GIN(hashtags);
CREATE INDEX IF NOT EXISTS idx_post_created_date ON posts(created_date);

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_created_date ON users(created_date);