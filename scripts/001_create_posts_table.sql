-- ASM Student Posts Database Schema
-- Creates posts table with all required fields

-- Create posts table (if not exists)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  filters TEXT[] NOT NULL DEFAULT '{}',
  tagged_members JSONB NOT NULL DEFAULT '[]',
  images TEXT[] NOT NULL DEFAULT '{}',
  author_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  rejection_reason TEXT
);

-- Create indexes for faster queries (if not exist)
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
