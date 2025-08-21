-- TOV Content Generator Database Schema
-- Best practices voor gestructureerde opslag van content, logs en metadata

-- Users table (voor toekomstige uitbreiding)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Brands table (merken/klanten)
CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    brand_guidelines TEXT,
    tone_of_voice TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Content types table (voor categorisering)
CREATE TABLE IF NOT EXISTS content_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Generated content table (hoofdtabel voor gegenereerde content)
CREATE TABLE IF NOT EXISTS generated_content (
    id TEXT PRIMARY KEY,
    brand_id TEXT NOT NULL,
    content_type_id TEXT NOT NULL,
    user_id TEXT,
    title TEXT,
    content TEXT NOT NULL,
    metadata TEXT,
    word_count INTEGER,
    character_count INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (content_type_id) REFERENCES content_types(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Generation logs table (voor prompt en response logs)
CREATE TABLE IF NOT EXISTS generation_logs (
    id TEXT PRIMARY KEY,
    content_id TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    response_text TEXT NOT NULL,
    model_name TEXT NOT NULL,
    model_version TEXT,
    tokens_used INTEGER,
    tokens_limit INTEGER,
    processing_time_ms INTEGER,
    status TEXT DEFAULT 'success',
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES generated_content(id)
);

-- Content versions table (voor versiebeheer)
CREATE TABLE IF NOT EXISTS content_versions (
    id TEXT PRIMARY KEY,
    content_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    change_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES generated_content(id),
    UNIQUE(content_id, version_number)
);

-- Tags table (voor categorisering en zoeken)
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Content tags table (many-to-many relatie)
CREATE TABLE IF NOT EXISTS content_tags (
    content_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (content_id, tag_id),
    FOREIGN KEY (content_id) REFERENCES generated_content(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Search history table (voor zoekfunctionaliteit)
CREATE TABLE IF NOT EXISTS search_history (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    search_query TEXT NOT NULL,
    filters TEXT,
    results_count INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes voor betere performance
CREATE INDEX IF NOT EXISTS idx_generated_content_brand_id ON generated_content(brand_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_type_id ON generated_content(content_type_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_created_at ON generated_content(created_at);
CREATE INDEX IF NOT EXISTS idx_generation_logs_content_id ON generation_logs(content_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_created_at ON generation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_content_id ON content_tags(content_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_tag_id ON content_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at);

-- Triggers voor updated_at timestamps
CREATE TRIGGER IF NOT EXISTS update_brands_updated_at 
    AFTER UPDATE ON brands
    BEGIN
        UPDATE brands SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_generated_content_updated_at 
    AFTER UPDATE ON generated_content
    BEGIN
        UPDATE generated_content SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Insert default content types
INSERT OR IGNORE INTO content_types (id, name, description, category) VALUES
    ('blog-post', 'Blog Post', 'Long-form content optimized for SEO', 'blog'),
    ('web-page', 'Web Page', 'Landing pages and website content', 'web'),
    ('social-media', 'Social Media', 'Short posts for social platforms', 'social'),
    ('email', 'Email', 'Email marketing content', 'email');

-- Insert default tags
INSERT OR IGNORE INTO tags (id, name, category) VALUES
    ('marketing', 'Marketing', 'industry'),
    ('seo', 'SEO', 'topic'),
    ('content', 'Content', 'topic'),
    ('social', 'Social Media', 'platform');
